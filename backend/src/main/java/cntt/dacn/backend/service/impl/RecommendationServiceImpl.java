package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.RankingService;
import cntt.dacn.backend.service.RecommendationService;
import cntt.dacn.backend.service.ToolExecutorService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import cntt.dacn.backend.service.impl.ai.RankedBook;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final ToolExecutorService toolExecutorService;
    private final RankingService rankingService;

    @Override
    public List<RankedBook> recommend(AiIntent intent, AiConversationMemory memory) {
        if (intent.isClarificationNeeded()) {
            return List.of();
        }

        List<Book> books = toolExecutorService.execute(intent, memory);
        return rankingService.rank(books, intent, memory);
    }
}
