package cntt.dacn.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class AiProductSuggestionResponse {

    private Long id;

    private String title;

    private String imageUrl;

    private String description;

    private BigDecimal price;

    private BigDecimal discountPrice;

    private Integer discountPercent;

    private Integer stock;

    private Integer soldCount;

    private Float averageRating;

    private LocalDate publishDate;

    private String authorName;

    private String publisherName;

    private String categoryName;

    private String detailUrl;

    private List<String> badges;

    private Double score;
}
