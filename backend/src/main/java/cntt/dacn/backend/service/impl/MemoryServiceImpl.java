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

        if (normalized.contains("thieu nhi") || normalized.contains("tre em")) {
            memory.setAgeGroup("children");
            memory.setCategory("Thiếu nhi");
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
        if (normalized.contains("200")) {
            return BigDecimal.valueOf(200000);
        }
        if (normalized.contains("300")) {
            return BigDecimal.valueOf(300000);
        }
        if (normalized.contains("500")) {
            return BigDecimal.valueOf(500000);
        }
        return null;
    }

    private String normalize(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
