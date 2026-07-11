package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.request.AiChatRequest;
import cntt.dacn.backend.dto.response.AiChatResponse;

public interface AiAssistantService {

    AiChatResponse chat(AiChatRequest request);
}
