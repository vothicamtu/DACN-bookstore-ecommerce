package cntt.dacn.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {

    private Long id;

    private String title;

    private String imageUrl;

    private String description;

    private BigDecimal price;

    private Integer discountPercent;

    private Integer stock;

    private String translator;

    private Integer pageCount;

    private String size;

    private LocalDate publishDate;

    private Float averageRating;

    private Integer soldCount;

    private String categoryName;

    private String authorName;

    private String publisherName;
}
