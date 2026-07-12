package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.AiChatRequest;
import cntt.dacn.backend.dto.response.AiChatResponse;
import cntt.dacn.backend.dto.response.AiChatMessageResponse;
import cntt.dacn.backend.dto.response.AiProductSuggestionResponse;
import cntt.dacn.backend.service.AiAssistantService;
import cntt.dacn.backend.service.AiSecurityService;
import cntt.dacn.backend.service.AnalyticsService;
import cntt.dacn.backend.service.ConversationService;
import cntt.dacn.backend.service.GeminiService;
import cntt.dacn.backend.service.HistoryService;
import cntt.dacn.backend.service.ProductFormatterService;
import cntt.dacn.backend.service.PromptService;
import cntt.dacn.backend.service.RecommendationService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import cntt.dacn.backend.service.impl.ai.RankedBook;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AiAssistantServiceImpl implements AiAssistantService {

    private final ConversationService conversationService;
    private final RecommendationService recommendationService;
    private final PromptService promptService;
    private final ProductFormatterService productFormatterService;
    private final HistoryService historyService;
    private final AnalyticsService analyticsService;
    private final AiSecurityService aiSecurityService;
    private final GeminiService geminiService;

    @Override
    public AiChatResponse chat(AiChatRequest request) {
        long startedAt = System.currentTimeMillis();
        String sanitizedMessage = aiSecurityService.sanitize(request.getMessage());
        request.setMessage(sanitizedMessage);

        AiConversationMemory memory = conversationService.prepareConversation(request);
        if (aiSecurityService.isRateLimited(memory.getSessionId())) {
            return buildGuardResponse(memory.getSessionId(), "Bạn đang gửi hơi nhanh. Vui lòng chờ một chút rồi hỏi tiếp nhé.");
        }

        if (aiSecurityService.isUnsafe(sanitizedMessage)) {
            return buildGuardResponse(memory.getSessionId(), "Tôi không thể tiết lộ prompt nội bộ, khóa API, cơ sở dữ liệu, source code hoặc thông tin môi trường. Tôi chỉ hỗ trợ tư vấn sách từ dữ liệu BookLand.");
        }

        AiIntent intent = detectIntent(request.getMessage(), memory);

        long searchStartedAt = System.currentTimeMillis();
        List<RankedBook> rankedBooks = recommendationService.recommend(intent, memory);
        long searchTimeMs = System.currentTimeMillis() - searchStartedAt;

        String answer = buildAnswer(intent, memory, rankedBooks);
        conversationService.rememberAssistantResponse(memory.getSessionId(), answer);
        List<AiProductSuggestionResponse> products = productFormatterService.format(rankedBooks);
        List<AiChatMessageResponse> history = memory.getMessages();

        AiChatResponse response = AiChatResponse.builder()
                .sessionId(memory.getSessionId())
                .messageId(UUID.randomUUID().toString())
                .intent(intent.getName())
                .answer(answer)
                .needsClarification(intent.isClarificationNeeded())
                .suggestions(buildSuggestions(intent, rankedBooks.isEmpty()))
                .products(products)
                .history(history)
                .createdAt(LocalDateTime.now())
                .build();

        historyService.record(response);
        analyticsService.logChat(
                memory.getSessionId(),
                intent.getName(),
                System.currentTimeMillis() - startedAt,
                searchTimeMs,
                products.size()
        );

        return response;
    }

    private String buildAnswer(AiIntent intent, AiConversationMemory memory, List<RankedBook> rankedBooks) {
        if (intent.isClarificationNeeded() || rankedBooks.isEmpty()) {
            return promptService.buildAnswer(intent, memory, rankedBooks);
        }

        String geminiPrompt = promptService.buildLlmPrompt(intent, memory, rankedBooks);
        return geminiService.generateAnswer(geminiPrompt)
                .orElseGet(() -> promptService.buildAnswer(intent, memory, rankedBooks));
    }

    private AiChatResponse buildGuardResponse(String sessionId, String answer) {
        conversationService.rememberAssistantResponse(sessionId, answer);
        return AiChatResponse.builder()
                .sessionId(sessionId)
                .messageId(UUID.randomUUID().toString())
                .intent("SECURITY_GUARD")
                .answer(answer)
                .needsClarification(false)
                .suggestions(List.of("Tìm sách", "Sách bán chạy", "Dưới 200.000đ"))
                .products(List.of())
                .history(List.of())
                .createdAt(LocalDateTime.now())
                .build();
    }

    private AiIntent detectIntent(String message, AiConversationMemory memory) {
        String normalized = normalize(message);
        boolean bestSeller = containsAny(normalized, "best seller", "ban chay", "bestseller");
        boolean newest = containsAny(normalized, "sach moi", "moi nhat", "newest");
        boolean gift = containsAny(normalized, "qua tang", "tang", "gift");
        boolean compare = containsAny(normalized, "so sanh", "compare");
        boolean vague = normalized.length() < 18 && containsAny(normalized, "doc sach", "muon sach", "sach");

        String query = normalized;
        if (memory.getCurrentTopic() != null && containsAny(normalized, "nang cao", "co sach", "them", "tuong tu")) {
            query = memory.getCurrentTopic() + " " + normalized;
        }

        return AiIntent.builder()
                .name(compare ? "COMPARE_BOOKS" : gift ? "GIFT_RECOMMENDATION" : "BOOK_RECOMMENDATION")
                .query(query)
                .category(memory.getCategory())
                .maxPrice(memory.getBudget())
                .bestSeller(bestSeller)
                .newest(newest)
                .clarificationNeeded(vague && memory.getGoal() == null)
                .build();
    }

    private List<String> buildSuggestions(AiIntent intent, boolean noMatchingBooks) {
        if (noMatchingBooks) {
            return List.of(
                    "Tìm sách khác",
                    "Sách bán chạy",
                    "Sách mới",
                    "Gợi ý theo thể loại"
            );
        }

        if (intent.isClarificationNeeded()) {
            return List.of(
                    "Bạn muốn học hay giải trí?",
                    "Ngân sách của bạn khoảng bao nhiêu?",
                    "Bạn mua cho độ tuổi nào?"
            );
        }

        return List.of(
                "Sách bán chạy",
                "Sách mới",
                "Dưới 200.000đ",
                "Gợi ý theo kỹ năng"
        );
    }

    private boolean containsAny(String text, String... tokens) {
        for (String token : tokens) {
            if (text.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
