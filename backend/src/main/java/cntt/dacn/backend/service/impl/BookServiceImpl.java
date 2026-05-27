package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.response.BookResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.exception.ResourceNotFoundException;
import cntt.dacn.backend.repository.BookRepository;
import cntt.dacn.backend.service.BookService;
import cntt.dacn.backend.specification.BookSpecification;
import cntt.dacn.backend.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;


    /**
     * GET ALL BOOKS
     */
    @Override
    public PagedResponse<BookResponse> getAllBooks(

            int page,

            int size,

            String sortBy,

            String sortDir
    ) {

        Sort sort =
                sortDir.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        Page<Book> books =
                bookRepository.findAll(pageable);

        List<BookResponse> content =
                books.getContent()
                        .stream()
                        .map(MapperUtil::mapToBookResponse)
                        .toList();

        return PagedResponse
                .<BookResponse>builder()

                .content(content)

                .page(books.getNumber())

                .size(books.getSize())

                .totalElements(
                        books.getTotalElements()
                )

                .totalPages(
                        books.getTotalPages()
                )

                .last(books.isLast())

                .build();
    }


    /**
     * GET BOOK BY ID
     */
    @Override
    public BookResponse getBookById(
            Long id
    ) {

        Book book =
                bookRepository.findById(id)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Book not found with id: "
                                                + id
                                )
                        );

        return MapperUtil.mapToBookResponse(book);
    }


    /**
     * SEARCH BOOKS
     */
    @Override
    public PagedResponse<BookResponse> searchBooks(

            String keyword,

            Long categoryId,

            BigDecimal minPrice,

            BigDecimal maxPrice,

            int page,

            int size,

            String sortBy,

            String sortDir
    ) {

        Sort sort =
                sortDir.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        Page<Book> books =
                bookRepository.findAll(

                        BookSpecification.searchBooks(
                                keyword,
                                categoryId,
                                minPrice,
                                maxPrice
                        ),

                        pageable
                );

        List<BookResponse> content =
                books.getContent()
                        .stream()
                        .map(MapperUtil::mapToBookResponse)
                        .toList();

        return PagedResponse
                .<BookResponse>builder()

                .content(content)

                .page(books.getNumber())

                .size(books.getSize())

                .totalElements(
                        books.getTotalElements()
                )

                .totalPages(
                        books.getTotalPages()
                )

                .last(books.isLast())

                .build();
    }
}