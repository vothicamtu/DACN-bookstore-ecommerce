package cntt.dacn.backend.service;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import cntt.dacn.backend.service.impl.ai.RankedBook;

import java.util.List;

public interface RankingService {

    List<RankedBook> rank(List<Book> books, AiIntent intent, AiConversationMemory memory);
}
