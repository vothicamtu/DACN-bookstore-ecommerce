package cntt.dacn.backend.dto.response;

import cntt.dacn.backend.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;

    private String username;

    private List<OrderItemResponse> items;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private String shippingAddress;

    private String phoneNumber;

    private String note;

    private LocalDateTime createdAt;
}