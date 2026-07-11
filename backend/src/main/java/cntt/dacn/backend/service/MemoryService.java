package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.AiChatMessageResponse;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;

import java.util.List;

public interface MemoryService {

    AiConversationMemory getOrCreate(String sessionId);

    void rememberUserMessage(String sessionId, String message);

    void rememberAssistantMessage(String sessionId, String message);

    void updateExtractedContext(String sessionId, String message);

    List<AiChatMessageResponse> getRecentMessages(String sessionId, int limit);
}
