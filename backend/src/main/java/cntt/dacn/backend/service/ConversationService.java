package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.request.AiChatRequest;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;

public interface ConversationService {

    AiConversationMemory prepareConversation(AiChatRequest request);

    void rememberAssistantResponse(String sessionId, String answer);
}
