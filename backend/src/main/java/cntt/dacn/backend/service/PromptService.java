package cntt.dacn.backend.service;

import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import cntt.dacn.backend.service.impl.ai.RankedBook;

import java.util.List;

public interface PromptService {

    String buildAnswer(AiIntent intent, AiConversationMemory memory, List<RankedBook> books);

    String buildLlmPrompt(AiIntent intent, AiConversationMemory memory, List<RankedBook> books);
}
