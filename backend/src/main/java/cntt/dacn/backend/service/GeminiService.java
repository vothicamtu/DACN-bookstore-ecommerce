package cntt.dacn.backend.service;

import java.util.Optional;

public interface GeminiService {

    Optional<String> generateAnswer(String prompt);

    /**
     * Dùng Gemini phân tích câu hỏi thành intent JSON.
     * Trả về: { "author", "category", "title", "maxPrice", "bestSeller", "newest" }
     */
    Optional<String> extractIntent(String userMessage, String conversationContext);
}
