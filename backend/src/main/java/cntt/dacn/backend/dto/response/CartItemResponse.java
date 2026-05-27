package dacn.cntt.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long cartItemId;

    private Long bookId;

    private String title;

    private String imageUrl;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;
}