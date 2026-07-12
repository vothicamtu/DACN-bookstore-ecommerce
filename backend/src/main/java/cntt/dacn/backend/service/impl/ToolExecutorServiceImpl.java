package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.SearchService;
import cntt.dacn.backend.service.ToolExecutorService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolExecutorServiceImpl implements ToolExecutorService {

    private final SearchService searchService;

    @Override
    public List<Book> execute(AiIntent intent, AiConversationMemory memory) {
        return searchService.searchBooks(intent, memory);
    }
}
