package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.response.AiProductSuggestionResponse;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.ProductFormatterService;
import cntt.dacn.backend.service.impl.ai.RankedBook;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductFormatterServiceImpl implements ProductFormatterService {

    @Override
    public List<AiProductSuggestionResponse> format(List<RankedBook> rankedBooks) {
        return rankedBooks.stream()
                .map(this::format)
                .toList();
    }

    private AiProductSuggestionResponse format(RankedBook rankedBook) {
        Book book = rankedBook.getBook();
        return AiProductSuggestionResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .imageUrl(book.getImageUrl())
                .description(shortDescription(book.getDescription()))
                .price(book.getPrice())
                .discountPrice(discountPrice(book))
                .discountPercent(book.getDiscountPercent())
                .stock(book.getStock())
                .soldCount(book.getSoldCount())
                .averageRating(book.getAverageRating())
                .publishDate(book.getPublishDate())
                .authorName(book.getAuthor() == null ? null : book.getAuthor().getAuthorName())
                .publisherName(book.getPublisher() == null ? null : book.getPublisher().getPublisherName())
                .categoryName(book.getCategory() == null ? null : book.getCategory().getCategoryName())
                .detailUrl("/books?keyword=" + URLEncoder.encode(book.getTitle(), StandardCharsets.UTF_8))
                .badges(buildBadges(book))
                .score(rankedBook.getScore())
                .build();
    }

    private BigDecimal discountPrice(Book book) {
        if (book.getPrice() == null || book.getDiscountPercent() == null || book.getDiscountPercent() <= 0) {
            return book.getPrice();
        }

        BigDecimal discount = BigDecimal.valueOf(100 - book.getDiscountPercent())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return book.getPrice().multiply(discount);
    }

    private List<String> buildBadges(Book book) {
        List<String> badges = new ArrayList<>();
        if (book.getSoldCount() != null && book.getSoldCount() >= 50) {
            badges.add("Best Seller");
        }
        if (book.getPublishDate() != null && book.getPublishDate().isAfter(LocalDate.now().minusMonths(3))) {
            badges.add("New");
        }
        if (book.getDiscountPercent() != null && book.getDiscountPercent() > 0) {
            badges.add("Sale");
        }
        return badges;
    }

    private String shortDescription(String description) {
        if (description == null || description.isBlank()) {
            return "";
        }
        return description.length() <= 140 ? description : description.substring(0, 137) + "...";
    }
}
