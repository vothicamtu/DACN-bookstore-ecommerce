package cntt.dacn.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long orderItemId;

    private Long bookId;

    private String title;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;
}