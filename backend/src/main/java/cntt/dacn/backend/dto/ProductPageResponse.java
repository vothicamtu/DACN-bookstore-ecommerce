package cntt.dacn.backend.dto;

import java.util.List;

public record ProductPageResponse(
        List<BookResponse> items,
        int page,
        int size,
        int totalPages,
        long totalItems
) {
}
