package cntt.dacn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;
}
