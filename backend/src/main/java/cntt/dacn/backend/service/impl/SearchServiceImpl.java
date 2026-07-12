package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.repository.BookRepository;
import cntt.dacn.backend.service.SearchService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private static final int SEARCH_POOL_SIZE = 120;

    private final BookRepository bookRepository;

    @Override
    public List<Book> searchBooks(AiIntent intent, AiConversationMemory memory) {
        Sort sort = Sort.by(Sort.Direction.DESC, "soldCount");
        if (intent.isNewest()) {
            sort = Sort.by(Sort.Direction.DESC, "publishDate");
        }

        return bookRepository.findAll(PageRequest.of(0, SEARCH_POOL_SIZE, sort)).getContent();
    }
}
