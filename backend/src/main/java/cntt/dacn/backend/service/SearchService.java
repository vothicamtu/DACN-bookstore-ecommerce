package cntt.dacn.backend.service;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;

import java.util.List;

public interface SearchService {

    List<Book> searchBooks(AiIntent intent, AiConversationMemory memory);
}
