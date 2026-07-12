package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.response.AiChatMessageResponse;
import cntt.dacn.backend.service.MemoryService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MemoryServiceImpl implements MemoryService {

    private final Map<String, AiConversationMemory> sessions = new ConcurrentHashMap<>();

    @Override
    public AiConversationMemory getOrCreate(String sessionId) {
        return sessions.computeIfAbsent(sessionId, key -> {
            AiConversationMemory memory = new AiConversationMemory();
            memory.setSessionId(key);
            return memory;
        });
    }

    @Override
    public void rememberUserMessage(String sessionId, String message) {
        AiConversationMemory memory = getOrCreate(sessionId);
        memory.setLastUserQuestion(message);
        memory.getMessages().add(buildMessage("user", message));
    }

    @Override
    public void rememberAssistantMessage(String sessionId, String message) {
        getOrCreate(sessionId).getMessages().add(buildMessage("assistant", message));
    }

    @Override
    public void updateExtractedContext(String sessionId, String message) {
        AiConversationMemory memory = getOrCreate(sessionId);
        String normalized = normalize(message);

        if (normalized.contains("python") || normalized.contains("java") || normalized.contains("react")) {
            memory.setCurrentTopic(extractTopic(normalized));
            memory.setGoal("learning");
        }

        // Extract category từ message — override nếu có category mới
        String category = extractCategory(normalized);
        if (category != null) {
            memory.setCategory(category);
            if (category.equals("Thiếu nhi")) {
                memory.setAgeGroup("children");
            }
        }

        BigDecimal budget = extractBudget(normalized);
        if (budget != null) {
            memory.setBudget(budget);
        }

        if (normalized.contains("tieng anh")) {
            memory.setLanguage("English");
        } else if (normalized.contains("tieng viet")) {
            memory.setLanguage("Vietnamese");
        }
    }

    private String extractCategory(String normalized) {
        if (normalized.contains("kinh te") || normalized.contains("tai chinh") || normalized.contains("dau tu")) return "Kinh tế";
        if (normalized.contains("thieu nhi") || normalized.contains("tre em")) return "Thiếu nhi";
        if (normalized.contains("van hoc") || normalized.contains("tieu thuyet") || normalized.contains("truyen")) return "Văn học";
        if (normalized.contains("ky nang") || normalized.contains("phat trien ban than")) return "Kỹ năng";
        if (normalized.contains("lap trinh") || normalized.contains("cong nghe") || normalized.contains("khoa hoc")) return "Khoa học - Công nghệ";
        if (normalized.contains("lich su") || normalized.contains("dia ly")) return "Lịch sử - Địa lý";
        if (normalized.contains("ngoai ngu") || normalized.contains("tieng anh") || normalized.contains("tieng nhat")) return "Ngoại ngữ";
        if (normalized.contains("giao khoa") || normalized.contains("tham khao") || normalized.contains("hoc sinh")) return "Giáo khoa";
        return null;
    }

    @Override
    public List<AiChatMessageResponse> getRecentMessages(String sessionId, int limit) {
        List<AiChatMessageResponse> messages = getOrCreate(sessionId).getMessages();
        int fromIndex = Math.max(messages.size() - limit, 0);
        return messages.subList(fromIndex, messages.size());
    }

    private AiChatMessageResponse buildMessage(String role, String message) {
        return AiChatMessageResponse.builder()
                .role(role)
                .content(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    private String extractTopic(String normalized) {
        if (normalized.contains("python")) {
            return "python";
        }
        if (normalized.contains("react")) {
            return "react";
        }
        return "java";
    }

    private BigDecimal extractBudget(String normalized) {
        // Xóa dấu chấm/phẩy ngăn cách hàng nghìn rồi tìm số
        String cleaned = normalized.replaceAll("[.,]", "");

        // Pattern: "duoi Xd", "duoi Xk", "duoi X dong", "ngan sach X", "X000d"...
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(\\d{3,7})")
                .matcher(cleaned);

        long maxVal = 0;
        while (m.find()) {
            long val = Long.parseLong(m.group(1));
            // Nếu số < 1000 thì đơn vị là nghìn (vd: "200k" → 200000)
            if (val < 1000) val *= 1000;
            if (val > maxVal && val <= 10_000_000) {
                maxVal = val;
            }
        }

        return maxVal > 0 ? BigDecimal.valueOf(maxVal) : null;
    }

    private String normalize(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
