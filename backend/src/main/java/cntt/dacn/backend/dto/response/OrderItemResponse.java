package cntt.dacn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long orderItemId;

    private Long id;

    private Long bookId;

    private String title;

    private String bookTitle;

    private String imageUrl;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;
}
