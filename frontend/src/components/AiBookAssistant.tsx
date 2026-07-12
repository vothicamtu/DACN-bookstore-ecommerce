import {
    Bot,
    ChevronDown,
    ChevronsUp,
    Copy,
    Heart,
    Loader2,
    Maximize2,
    MessageSquareText,
    Minimize2,
    RefreshCcw,
    RotateCcw,
    Send,
    ShoppingCart,
    Square,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl";
import { addToCart } from "../services/cartService";
import {
    sendAiMessage,
    type AiChatMessage,
    type AiProductSuggestion,
} from "../services/aiAssistantService";

type AssistantMessage = AiChatMessage & {
    id: string;
    products?: AiProductSuggestion[];
    suggestions?: string[];
    streaming?: boolean;
};

interface AiBookAssistantProps {
    open: boolean;
    onClose: () => void;
}

const STORAGE_KEY = "bookland:ai-assistant";
const SESSION_KEY = "bookland:ai-session-id";

const quickSuggestions = [
    "Sách bán chạy",
    "Học lập trình",
    "Dưới 200.000đ",
    "Quà tặng",
    "Tiểu thuyết",
    "Thiếu nhi",
];

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
});

export default function AiBookAssistant({ open, onClose }: AiBookAssistantProps) {
    const [messages, setMessages] = useState<AssistantMessage[]>(() => loadMessages());
    const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY) ?? "");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [copiedId, setCopiedId] = useState("");
    const [addingBookId, setAddingBookId] = useState<number | null>(null);
    const [cartMessage, setCartMessage] = useState("");
    const [lastPrompt, setLastPrompt] = useState("");
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const streamTimerRef = useRef<number | null>(null);
    const stopRef = useRef(false);

    const hasMessages = messages.length > 0;
    const panelClassName = [
        "bookland-ai",
        open ? "is-open" : "",
        expanded ? "is-expanded" : "",
        minimized ? "is-minimized" : "",
    ].join(" ");

    const visibleMessages = useMemo(
        () => messages.slice(Math.max(messages.length - 80, 0)),
        [messages]
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-80)));
    }, [messages]);

    useEffect(() => {
        if (sessionId) {
            localStorage.setItem(SESSION_KEY, sessionId);
        }
    }, [sessionId]);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading, open, minimized]);

    useEffect(() => {
        const handleShortcut = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "j") {
                event.preventDefault();
                setMinimized((current) => !current);
            }
        };

        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, []);

    useEffect(() => {
        return () => {
            if (streamTimerRef.current) {
                window.clearInterval(streamTimerRef.current);
            }
        };
    }, []);

    async function submitMessage(value = input) {
        const prompt = value.trim();
        if (!prompt || loading) {
            return;
        }

        stopStreaming();
        stopRef.current = false;
        setStreaming(true);
        setInput("");
        setCartMessage("");
        setLastPrompt(prompt);

        const userMessage: AssistantMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: prompt,
            timestamp: new Date().toISOString(),
        };

        setMessages((current) => [...current, userMessage]);
        setLoading(true);

        try {
            const response = await sendAiMessage({
                sessionId: sessionId || undefined,
                message: prompt,
                pageUrl: window.location.pathname + window.location.search,
            });

            setSessionId(response.sessionId);
            streamAssistantResponse(response.answer, response.products, response.suggestions);
        } catch {
            streamAssistantResponse(
                "Mình chưa kết nối được AI Assistant. Bạn thử lại sau ít phút nhé.",
                [],
                ["Thử lại", "Sách bán chạy"]
            );
        } finally {
            setLoading(false);
        }
    }

    function streamAssistantResponse(
        answer: string,
        products: AiProductSuggestion[],
        suggestions: string[]
    ) {
        const messageId = crypto.randomUUID();
        const chars = Array.from(answer);
        let index = 0;

        setMessages((current) => [
            ...current,
            {
                id: messageId,
                role: "assistant",
                content: "",
                products,
                suggestions,
                streaming: true,
                timestamp: new Date().toISOString(),
            },
        ]);

        streamTimerRef.current = window.setInterval(() => {
            if (stopRef.current || index >= chars.length) {
                stopStreaming();
                setMessages((current) =>
                    current.map((message) =>
                        message.id === messageId
                            ? { ...message, content: answer.slice(0, index), streaming: false }
                            : message
                    )
                );
                return;
            }

            index += 3;
            setMessages((current) =>
                current.map((message) =>
                    message.id === messageId
                        ? { ...message, content: chars.slice(0, index).join("") }
                        : message
                )
            );
        }, 18);
    }

    function stopStreaming() {
        stopRef.current = true;
        setStreaming(false);
        if (streamTimerRef.current) {
            window.clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
        }
    }

    function clearChat() {
        stopStreaming();
        setMessages([]);
        setCartMessage("");
        localStorage.removeItem(STORAGE_KEY);
    }

    async function copyMessage(message: AssistantMessage) {
        await navigator.clipboard.writeText(message.content);
        setCopiedId(message.id);
        window.setTimeout(() => setCopiedId(""), 1200);
    }

    async function handleAddToCart(bookId: number) {
        setAddingBookId(bookId);
        setCartMessage("");

        try {
            await addToCart(bookId, 1);
            setCartMessage("Đã thêm sách vào giỏ hàng.");
        } catch {
            setCartMessage("Bạn cần đăng nhập trước khi thêm sách vào giỏ hàng.");
        } finally {
            setAddingBookId(null);
        }
    }

    if (!open) {
        return null;
    }

    return (
        <aside className={panelClassName} aria-label="AI Book Assistant">
            <div className="bookland-ai__header">
                <button
                    type="button"
                    className="bookland-ai__titleButton"
                    onClick={() => setMinimized((current) => !current)}
                >
                    <span className="bookland-ai__avatar">
                        <Bot aria-hidden="true" />
                    </span>
                    <span>
                        <strong>AI Book Assistant</strong>
                        <small>{minimized ? "Đang thu nhỏ" : "Sẵn sàng tư vấn"}</small>
                    </span>
                </button>

                <div className="bookland-ai__headerActions">
                    <button type="button" title="Xoa chat" onClick={clearChat}>
                        <Trash2 aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        title={expanded ? "Thu gon" : "Mo rong"}
                        onClick={() => setExpanded((current) => !current)}
                    >
                        {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
                    </button>
                    <button type="button" title="Thu nho" onClick={() => setMinimized((current) => !current)}>
                        {minimized ? <ChevronsUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                    </button>
                    <button type="button" title="Đóng" onClick={onClose}>
                        <X aria-hidden="true" />
                    </button>
                </div>
            </div>

            {!minimized ? (
                <>
                    <div className="bookland-ai__messages" ref={scrollRef}>
                        {!hasMessages ? <EmptyState onPick={submitMessage} /> : null}

                        {visibleMessages.map((message) => (
                            <article
                                key={message.id}
                                className={`bookland-ai__message bookland-ai__message--${message.role}`}
                            >
                                <div className="bookland-ai__bubble">
                                    <MarkdownText value={message.content} />
                                    {message.streaming ? <span className="bookland-ai__cursor" /> : null}

                                    {message.products && message.products.length > 0 ? (
                                        <div className="bookland-ai__products">
                                            {message.products.map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    adding={addingBookId === product.id}
                                                    onAddToCart={handleAddToCart}
                                                />
                                            ))}
                                        </div>
                                    ) : null}

                                    {message.suggestions && message.suggestions.length > 0 ? (
                                        <div className="bookland-ai__chips">
                                            {message.suggestions.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    onClick={() => submitMessage(suggestion)}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="bookland-ai__meta">
                                    <time>{formatTime(message.timestamp)}</time>
                                    {message.role === "assistant" ? (
                                        <>
                                            <button type="button" onClick={() => copyMessage(message)}>
                                                <Copy aria-hidden="true" />
                                                {copiedId === message.id ? "Đã sao chép" : "Sao chép"}
                                            </button>
                                            <button type="button" onClick={() => submitMessage(lastPrompt)}>
                                                <RefreshCcw aria-hidden="true" />
                                                Thử lại
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            </article>
                        ))}

                        {loading ? (
                            <div className="bookland-ai__thinking">
                                <Loader2 aria-hidden="true" />
                                <span>AI đang tìm sách trong BookLand...</span>
                            </div>
                        ) : null}
                    </div>

                    {cartMessage ? <div className="bookland-ai__notice">{cartMessage}</div> : null}

                    <form
                        className="bookland-ai__composer"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitMessage();
                        }}
                    >
                        <textarea
                            value={input}
                            placeholder="Hỏi về sách, ngân sách, tác giả, thể loại..."
                            rows={1}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    submitMessage();
                                }
                            }}
                        />
                        {loading || streaming ? (
                            <button type="button" title="Dừng tạo" onClick={stopStreaming}>
                                <Square aria-hidden="true" />
                            </button>
                        ) : (
                            <button type="submit" title="Gửi">
                                <Send aria-hidden="true" />
                            </button>
                        )}
                    </form>
                </>
            ) : null}
        </aside>
    );
}

function EmptyState({ onPick }: { onPick: (value: string) => void }) {
    return (
        <section className="bookland-ai__empty">
            <div className="bookland-ai__emptyIcon">
                <MessageSquareText aria-hidden="true" />
            </div>
            <h2>Xin chào, tôi là AI Book Assistant.</h2>
            <p>Tôi có thể giúp bạn tìm sách, so sánh sách, chọn quà và gợi ý theo ngân sách.</p>
            <div className="bookland-ai__chips">
                {quickSuggestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => onPick(suggestion)}>
                        {suggestion}
                    </button>
                ))}
            </div>
        </section>
    );
}

function ProductCard({
    product,
    adding,
    onAddToCart,
}: {
    product: AiProductSuggestion;
    adding: boolean;
    onAddToCart: (bookId: number) => void;
}) {
    const imageUrl = resolveImageUrl(product.imageUrl);
    const price = product.discountPrice ?? product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;

    return (
        <article className="bookland-aiProduct">
            <Link to={product.detailUrl} className="bookland-aiProduct__cover">
                {imageUrl ? <img src={imageUrl} alt={product.title} loading="lazy" /> : null}
                <span>BookLand</span>
            </Link>

            <div className="bookland-aiProduct__body">
                <div className="bookland-aiProduct__badges">
                    {product.badges.map((badge) => (
                        <span key={badge}>{badge}</span>
                    ))}
                </div>
                <Link to={product.detailUrl} className="bookland-aiProduct__title">
                    {product.title}
                </Link>
                <p>{product.authorName ?? "Đang cập nhật"}</p>
                <p>{product.publisherName ?? "NXB đang cập nhật"}</p>
                <p>{product.categoryName ?? "Chưa phân loại"}</p>
                {product.description ? <p className="bookland-aiProduct__desc">{product.description}</p> : null}

                <div className="bookland-aiProduct__price">
                    <strong>{currencyFormatter.format(price)}</strong>
                    {hasDiscount ? <span>{currencyFormatter.format(product.price)}</span> : null}
                </div>

                <div className="bookland-aiProduct__stats">
                    <span>Đánh giá {(product.averageRating ?? 0).toFixed(1)}</span>
                    <span>Đã bán {product.soldCount ?? 0}</span>
                    <span>Tồn {product.stock ?? 0}</span>
                </div>

                <div className="bookland-aiProduct__actions">
                    <Link to={product.detailUrl}>Xem chi tiết</Link>
                    <button type="button" disabled={adding} onClick={() => onAddToCart(product.id)}>
                        <ShoppingCart aria-hidden="true" />
                        {adding ? "Đang thêm" : "Thêm giỏ"}
                    </button>
                    <button type="button" title="Yêu thích">
                        <Heart aria-hidden="true" />
                    </button>
                    <button type="button">
                        <RotateCcw aria-hidden="true" />
                        So sánh
                    </button>
                </div>
            </div>
        </article>
    );
}

function MarkdownText({ value }: { value: string }) {
    return (
        <div className="bookland-ai__markdown">
            {value.split("\n").map((line, index) => {
                if (line.startsWith("```")) {
                    return null;
                }

                if (line.startsWith("    ")) {
                    return <code key={`${line}-${index}`}>{line.trim()}</code>;
                }

                return <p key={`${line}-${index}`}>{renderInlineMarkdown(line)}</p>;
            })}
        </div>
    );
}

function renderInlineMarkdown(line: string) {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
        }
        return <span key={`${part}-${index}`}>{part}</span>;
    });
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function loadMessages(): AssistantMessage[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
