package cntt.dacn.backend.service;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;

import java.util.List;

public interface ToolExecutorService {

    List<Book> execute(AiIntent intent, AiConversationMemory memory);
}
