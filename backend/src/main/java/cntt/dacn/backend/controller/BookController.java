package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.BookResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import cntt.dacn.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookController {

    private final BookService bookService;

    /**
     * GET ALL BOOKS
     */
    @GetMapping
    public ResponseEntity<
            ApiResponse<PagedResponse<BookResponse>>
            > getAllBooks(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDir
    ) {

        PagedResponse<BookResponse> response =
                bookService.getAllBooks(
                        page,
                        size,
                        sortBy,
                        sortDir
                );

        return ResponseEntity.ok(

                ApiResponse
                        .<PagedResponse<BookResponse>>
                                builder()

                        .success(true)

                        .message(
                                "Books retrieved successfully"
                        )

                        .data(response)

                        .build()
        );
    }


    /**
     * GET BOOK BY ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<BookResponse>
            > getBookById(

            @PathVariable Long id
    ) {

        BookResponse response =
                bookService.getBookById(id);

        return ResponseEntity.ok(

                ApiResponse
                        .<BookResponse>builder()

                        .success(true)

                        .message(
                                "Book retrieved successfully"
                        )

                        .data(response)

                        .build()
        );
    }


    /**
     * SEARCH BOOKS
     */
    @GetMapping("/search")
    public ResponseEntity<
            ApiResponse<PagedResponse<BookResponse>>
            > searchBooks(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Long categoryId,

            @RequestParam(required = false)
            BigDecimal minPrice,

            @RequestParam(required = false)
            BigDecimal maxPrice,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDir
    ) {

        PagedResponse<BookResponse> response =
                bookService.searchBooks(
                        keyword,
                        categoryId,
                        minPrice,
                        maxPrice,
                        page,
                        size,
                        sortBy,
                        sortDir
                );

        return ResponseEntity.ok(

                ApiResponse
                        .<PagedResponse<BookResponse>>
                                builder()

                        .success(true)

                        .message(
                                "Search books successfully"
                        )

                        .data(response)

                        .build()
        );
    }
}