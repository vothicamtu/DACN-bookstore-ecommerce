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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.text.Normalizer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
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

        // Thử Gemini extract intent trước — chính xác hơn keyword matching
        String context = memory.getLastUserQuestion() != null
                ? "Câu hỏi trước: " + memory.getLastUserQuestion() : "";
        Optional<AiIntent> geminiIntent = tryGeminiIntent(message, normalized, context);
        if (geminiIntent.isPresent()) {
            return geminiIntent.get();
        }

        // Fallback: keyword matching
        return buildIntentFromKeywords(normalized, memory);
    }

    private Optional<AiIntent> tryGeminiIntent(String message, String normalized, String context) {
        Optional<String> jsonOpt = geminiService.extractIntent(message, context);
        if (jsonOpt.isEmpty()) return Optional.empty();
        try {
            String json = jsonOpt.get().trim()
                    .replaceAll("(?s)```[a-zA-Z]*\\n?", "").replaceAll("```", "").trim();
            com.fasterxml.jackson.databind.JsonNode node =
                    new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);

            String author   = nullableText(node, "author");
            String category = nullableText(node, "category");
            String title    = nullableText(node, "title");
            boolean bestSeller = node.path("bestSeller").asBoolean(false);
            boolean newest     = node.path("newest").asBoolean(false);
            java.math.BigDecimal maxPrice = node.hasNonNull("maxPrice")
                    ? java.math.BigDecimal.valueOf(node.get("maxPrice").asLong()) : null;

            String query = title != null ? title : normalized;

            log.info("Gemini intent: author={} category={} title={} maxPrice={} bestSeller={} newest={}",
                    author, category, title, maxPrice, bestSeller, newest);

            return Optional.of(AiIntent.builder()
                    .name("BOOK_RECOMMENDATION")
                    .query(query)
                    .author(author)
                    .category(category)
                    .maxPrice(maxPrice)
                    .bestSeller(bestSeller)
                    .newest(newest)
                    .clarificationNeeded(false)
                    .build());
        } catch (Exception ex) {
            log.warn("Failed to parse Gemini intent JSON, falling back to keyword matching", ex);
            return Optional.empty();
        }
    }

    private String nullableText(com.fasterxml.jackson.databind.JsonNode node, String field) {
        if (node.hasNonNull(field)) {
            String val = node.get(field).asText("").trim();
            return val.isEmpty() || val.equals("null") ? null : val;
        }
        return null;
    }

    private AiIntent buildIntentFromKeywords(String normalized, AiConversationMemory memory) {
        boolean bestSeller = containsAny(normalized, "best seller", "ban chay", "bestseller");
        boolean newest = containsAny(normalized, "sach moi", "moi nhat", "newest");
        boolean gift = containsAny(normalized, "qua tang", "tang", "gift");
        boolean compare = containsAny(normalized, "so sanh", "compare");
        boolean vague = !bestSeller && !newest && !gift
                && normalized.length() < 18
                && containsAny(normalized, "doc sach", "muon sach", "sach");

        String author = extractAuthor(normalized);
        java.math.BigDecimal maxPrice = extractMaxPrice(normalized);
        if (maxPrice == null) maxPrice = memory.getBudget();
        String category = extractCategory(normalized);
        if (category == null) category = memory.getCategory();

        boolean isContinuation = containsAny(normalized, "them", "tuong tu", "khac", "cung tac gia", "nua", "cuon nua");
        String resolvedAuthor = author != null ? author : (isContinuation ? memory.getFavoriteAuthor() : null);

        String query = normalized;
        if (memory.getCurrentTopic() != null && containsAny(normalized, "nang cao", "co sach", "them", "tuong tu")) {
            query = memory.getCurrentTopic() + " " + normalized;
        }

        return AiIntent.builder()
                .name(compare ? "COMPARE_BOOKS" : gift ? "GIFT_RECOMMENDATION" : "BOOK_RECOMMENDATION")
                .query(query)
                .author(resolvedAuthor)
                .category(category)
                .maxPrice(maxPrice)
                .bestSeller(bestSeller)
                .newest(newest)
                .clarificationNeeded(vague && memory.getGoal() == null)
                .build();
    }

    // Extract category trực tiếp từ message
    private String extractCategory(String normalized) {
        if (normalized.contains("kinh te") || normalized.contains("tai chinh") || normalized.contains("dau tu")) return "Kinh tế";
        if (normalized.contains("thieu nhi") || normalized.contains("tre em")) return "Thiếu nhi";
        if (normalized.contains("van hoc") || normalized.contains("tieu thuyet") || normalized.contains("truyen")) return "Văn học";
        if (normalized.contains("ky nang") || normalized.contains("phat trien ban than")) return "Kỹ năng";
        if (normalized.contains("lap trinh") || normalized.contains("cong nghe") || normalized.contains("khoa hoc")) return "Khoa học - Công nghệ";
        if (normalized.contains("lich su") || normalized.contains("dia ly")) return "Lịch sử - Địa lý";
        if (normalized.contains("ngoai ngu") || normalized.contains("tieng nhat") || normalized.contains("tieng han")) return "Ngoại ngữ";
        if (normalized.contains("giao khoa") || normalized.contains("tham khao") || normalized.contains("hoc sinh")) return "Giáo khoa";
        return null;
    }

    // Parse giá tối đa từ câu hỏi: "dưới 200k", "dưới 200.000đ", "200000", "150 nghìn"...
    private java.math.BigDecimal extractMaxPrice(String normalized) {
        String cleaned = normalized.replaceAll("[.,]", "");
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(\\d{3,7})")
                .matcher(cleaned);
        long maxVal = 0;
        while (m.find()) {
            long val = Long.parseLong(m.group(1));
            if (val < 1000) val *= 1000;
            if (val > maxVal && val <= 10_000_000) maxVal = val;
        }
        log.info("extractMaxPrice input='{}' cleaned='{}' result={}", normalized, cleaned, maxVal);
        return maxVal > 0 ? java.math.BigDecimal.valueOf(maxVal) : null;
    }

    // Extract tên tác giả từ các pattern: "sách của X", "tác giả X", "mới nhất của X", "bán chạy của X"...
    // Hoặc chỉ là tên người (2-4 từ, không chứa keyword sách)
    private String extractAuthor(String normalized) {
        String[] triggers = {
            "tac pham cua ", "cua tac gia ", "sach cua ", "tac gia ",
            "moi nhat cua ", "ban chay cua ", "hay nhat cua ", "noi tieng cua ",
            "by ", "author "
        };
        // Các từ kết thúc tên tác giả
        String[] stopWords = { " co ", " khong", " nhe", " nao", " duoc", " voi",
                " the ", " va ", " hoac ", " ngoai ", " kem " };

        for (String trigger : triggers) {
            int idx = normalized.indexOf(trigger);
            if (idx >= 0) {
                String after = normalized.substring(idx + trigger.length()).trim();
                // Cắt tại dấu câu
                String name = after.split("[,;.!?\n]")[0].trim();
                // Cắt tại stop word
                for (String stop : stopWords) {
                    int stopIdx = name.indexOf(stop);
                    if (stopIdx > 0) {
                        name = name.substring(0, stopIdx).trim();
                    }
                }
                if (name.length() >= 3) {
                    return name;
                }
            }
        }

        // Toàn bộ query trông như tên người (2-4 từ, không chứa keyword sách, không phải giá tiền)
        String[] bookKeywords = { "sach", "doc", "mua", "tim", "the loai", "hot", "ban chay" };
        String[] words = normalized.split("\\s+");
        if (words.length >= 2 && words.length <= 4) {
            boolean hasBookKeyword = false;
            for (String kw : bookKeywords) {
                if (normalized.contains(kw)) { hasBookKeyword = true; break; }
            }
            boolean hasNumber = normalized.matches(".*\\d+.*");
            if (!hasBookKeyword && !hasNumber) {
                return normalized;
            }
        }

        return null;
    }

    private List<String> buildSuggestions(AiIntent intent, boolean noMatchingBooks) {
        if (noMatchingBooks) {
            return List.of("Tìm sách khác", "Sách bán chạy", "Sách mới", "Gợi ý theo thể loại");
        }
        if (intent.isClarificationNeeded()) {
            return List.of("Bạn muốn học hay giải trí?", "Ngân sách của bạn khoảng bao nhiêu?", "Bạn mua cho độ tuổi nào?");
        }
        if (intent.getAuthor() != null && !intent.getAuthor().isBlank()) {
            return List.of(
                    "Sách bán chạy của " + intent.getAuthor(),
                    "Sách mới nhất của " + intent.getAuthor(),
                    "Tìm tác giả khác",
                    "Sách bán chạy"
            );
        }
        return List.of("Sách bán chạy", "Sách mới", "Dưới 200.000đ", "Gợi ý theo kỹ năng");
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
