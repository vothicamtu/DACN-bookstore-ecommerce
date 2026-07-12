package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.repository.BookRepository;
import cntt.dacn.backend.service.SearchService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
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

        boolean hasAuthor = intent.getAuthor() != null && !intent.getAuthor().isBlank();
        boolean hasCategory = intent.getCategory() != null && !intent.getCategory().isBlank();

        // Filter author/category in-memory để tránh vấn đề so sánh dấu tiếng Việt
        if (hasAuthor || hasCategory) {
            List<Book> pool = bookRepository.findAll(PageRequest.of(0, SEARCH_POOL_SIZE, sort)).getContent();
            return pool.stream()
                    .filter(book -> matchesAuthor(book, intent.getAuthor()))
                    .filter(book -> matchesCategory(book, intent.getCategory()))
                    .filter(book -> intent.getMaxPrice() == null || book.getPrice() == null
                            || book.getPrice().compareTo(intent.getMaxPrice()) <= 0)
                    .toList();
        }

        // Chỉ filter giá → dùng DB query
        if (intent.getMaxPrice() != null) {
            Specification<Book> spec = (root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), intent.getMaxPrice());
            return bookRepository.findAll(spec, PageRequest.of(0, SEARCH_POOL_SIZE, sort)).getContent();
        }

        return bookRepository.findAll(PageRequest.of(0, SEARCH_POOL_SIZE, sort)).getContent();
    }

    private boolean matchesAuthor(Book book, String intentAuthor) {
        if (intentAuthor == null || intentAuthor.isBlank()) return true;
        if (book.getAuthor() == null) return false;
        return normalize(book.getAuthor().getAuthorName()).contains(normalize(intentAuthor));
    }

    private boolean matchesCategory(Book book, String intentCategory) {
        if (intentCategory == null || intentCategory.isBlank()) return true;
        if (book.getCategory() == null) return false;
        return normalize(book.getCategory().getCategoryName()).contains(normalize(intentCategory));
    }

    private String normalize(String value) {
        String n = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return n.replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
