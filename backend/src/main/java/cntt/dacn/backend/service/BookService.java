package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.BookResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import java.math.BigDecimal;
public interface BookService {

    PagedResponse<BookResponse> getAllBooks(
            String category,
            Long categoryId,
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Float minRating,
            String sort,
            int page,
            int size
    );

    BookResponse getBookById(Long id);

    PagedResponse<BookResponse> searchBooks(
            String keyword,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String sortDir
    );
}
