package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.AiChatRequest;
import cntt.dacn.backend.service.ConversationService;
import cntt.dacn.backend.service.MemoryService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final MemoryService memoryService;

    @Override
    public AiConversationMemory prepareConversation(AiChatRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }

        AiConversationMemory memory = memoryService.getOrCreate(sessionId);
        memoryService.rememberUserMessage(sessionId, request.getMessage());
        memoryService.updateExtractedContext(sessionId, request.getMessage());

        return memory;
    }

    @Override
    public void rememberAssistantResponse(String sessionId, String answer) {
        memoryService.rememberAssistantMessage(sessionId, answer);
    }
}
