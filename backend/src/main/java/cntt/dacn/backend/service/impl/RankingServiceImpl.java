package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.service.RankingService;
import cntt.dacn.backend.service.impl.ai.AiConversationMemory;
import cntt.dacn.backend.service.impl.ai.AiIntent;
import cntt.dacn.backend.service.impl.ai.RankedBook;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class RankingServiceImpl implements RankingService {

    private static final double TITLE_WEIGHT = 9.0;
    private static final double AUTHOR_WEIGHT = 7.0;
    private static final double PUBLISHER_WEIGHT = 5.0;
    private static final double CATEGORY_WEIGHT = 6.0;
    private static final double PARTIAL_WEIGHT = 2.0;
    private static final double RATING_WEIGHT = 1.5;
    private static final double SALES_WEIGHT = 0.02;
    private static final double DISCOUNT_WEIGHT = 0.08;
    private static final double STOCK_WEIGHT = 0.6;
    private static final double NEWEST_WEIGHT = 2.0;
    private static final Set<String> QUERY_STOP_WORDS = Set.of(
            "ban", "can", "cho", "cua", "dang", "hay", "la", "minh", "mot", "muon",
            "nhung", "sach", "tim", "toi", "ve", "voi", "xin", "y", "goi"
    );

    @Override
    public List<RankedBook> rank(List<Book> books, AiIntent intent, AiConversationMemory memory) {
        return books.stream()
                .filter(book -> isBrowseIntent(intent) || matchesQuery(book, intent.getQuery()))
                .map(book -> RankedBook.builder()
                        .book(book)
                        .score(score(book, intent, memory))
                        .build())
                .filter(rankedBook -> rankedBook.getScore() > 0 || intent.isBestSeller() || intent.isNewest())
                .sorted(Comparator.comparing(RankedBook::getScore).reversed())
                .limit(8)
                .toList();
    }

    private boolean isBrowseIntent(AiIntent intent) {
        return intent.isBestSeller() || intent.isNewest() || value(intent.getQuery()).isBlank();
    }

    private boolean matchesQuery(Book book, String query) {
        String searchable = String.join(" ",
                value(book.getTitle()),
                book.getAuthor() == null ? "" : value(book.getAuthor().getAuthorName()),
                book.getPublisher() == null ? "" : value(book.getPublisher().getPublisherName()),
                book.getCategory() == null ? "" : value(book.getCategory().getCategoryName()),
                value(book.getDescription())
        );

        List<String> keywords = Arrays.stream(value(query).split("\\s+"))
                .filter(token -> token.length() > 2)
                .filter(token -> !QUERY_STOP_WORDS.contains(token))
                .toList();

        return keywords.isEmpty() || keywords.stream().anyMatch(searchable::contains);
    }

    private double score(Book book, AiIntent intent, AiConversationMemory memory) {
        double score = 0;
        String query = value(intent.getQuery());
        String title = value(book.getTitle());
        String author = book.getAuthor() == null ? "" : value(book.getAuthor().getAuthorName());
        String publisher = book.getPublisher() == null ? "" : value(book.getPublisher().getPublisherName());
        String category = book.getCategory() == null ? "" : value(book.getCategory().getCategoryName());

        score += contains(title, query) ? TITLE_WEIGHT : fuzzyScore(title, query);
        score += contains(author, query) ? AUTHOR_WEIGHT : fuzzyScore(author, query);
        score += contains(publisher, query) ? PUBLISHER_WEIGHT : 0;
        score += contains(category, query) ? CATEGORY_WEIGHT : 0;

        if (memory.getCurrentTopic() != null && title.contains(memory.getCurrentTopic())) {
            score += TITLE_WEIGHT;
        }

        if (intent.getCategory() != null && category.contains(value(intent.getCategory()))) {
            score += CATEGORY_WEIGHT;
        }

        if (intent.getMaxPrice() != null && book.getPrice() != null) {
            score += book.getPrice().compareTo(intent.getMaxPrice()) <= 0 ? 5 : -4;
        }

        score += book.getAverageRating() == null ? 0 : book.getAverageRating() * RATING_WEIGHT;
        score += book.getSoldCount() == null ? 0 : Math.min(book.getSoldCount() * SALES_WEIGHT, 6);
        score += book.getDiscountPercent() == null ? 0 : book.getDiscountPercent() * DISCOUNT_WEIGHT;
        score += book.getStock() != null && book.getStock() > 0 ? STOCK_WEIGHT : -2;

        if (book.getPublishDate() != null && book.getPublishDate().isAfter(LocalDate.now().minusMonths(6))) {
            score += NEWEST_WEIGHT;
        }

        return score;
    }

    private double fuzzyScore(String source, String query) {
        if (query.isBlank()) {
            return PARTIAL_WEIGHT;
        }

        double score = 0;
        for (String token : query.split("\\s+")) {
            if (token.length() > 2 && source.contains(token)) {
                score += PARTIAL_WEIGHT;
            }
        }
        return score;
    }

    private boolean contains(String source, String query) {
        return !query.isBlank() && source.contains(query);
    }

    private String value(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
