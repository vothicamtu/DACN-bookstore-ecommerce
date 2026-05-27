package cntt.dacn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
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
    private Long categoryId;
    private String categoryName;
    private Long authorId;
    private String authorName;
    private Long publisherId;
    private String publisherName;
}
