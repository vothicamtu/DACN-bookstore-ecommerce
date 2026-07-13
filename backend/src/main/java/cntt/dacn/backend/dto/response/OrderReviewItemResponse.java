package cntt.dacn.backend.dto.response;

import cntt.dacn.backend.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderReviewItemResponse {

    private Long orderId;

    private OrderStatus orderStatus;

    private Long orderItemId;

    private Long bookId;

    private String title;

    private String imageUrl;

    private String authorName;

    private String categoryName;

    private Integer quantity;

    private BigDecimal price;

    private boolean reviewed;

    private Integer existingRating;

    private String existingComment;
}
