package cntt.dacn.backend.dto;

import cntt.dacn.backend.entity.Book;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookResponse(
        Long id,
        String title,
        String imageUrl,
        String description,
        BigDecimal price,
        Integer discountPercent,
        Integer stock,
        String translator,
        Integer pageCount,
        String size,
        LocalDate publishDate,
        Float averageRating,
        Long categoryId,
        String categoryName,
        Long authorId,
        String authorName,
        Long publisherId,
        String publisherName
) {
    public static BookResponse from(Book book) {
        var category = book.getCategory();
        var author = book.getAuthor();
        var publisher = book.getPublisher();

        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getImageUrl(),
                book.getDescription(),
                book.getPrice(),
                book.getDiscountPercent(),
                book.getStock(),
                book.getTranslator(),
                book.getPageCount(),
                book.getSize(),
                book.getPublishDate(),
                book.getAverageRating(),
                category != null ? category.getId() : null,
                category != null ? category.getCategoryName() : null,
                author != null ? author.getId() : null,
                author != null ? author.getAuthorName() : null,
                publisher != null ? publisher.getId() : null,
                publisher != null ? publisher.getPublisherName() : null
        );
    }
}
