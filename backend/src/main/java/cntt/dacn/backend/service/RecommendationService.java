package cntt.dacn.backend.service;

import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import cntt.dacn.backend.service.impl.ai.RankedBook;

import java.util.List;

public interface RecommendationService {

    List<RankedBook> recommend(AiIntent intent, AiConversationMemory memory);
}
