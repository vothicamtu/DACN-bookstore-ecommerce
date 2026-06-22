package cntt.dacn.backend.dto.response;

import cntt.dacn.backend.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;

    private Long id;

    private Long userId;

    private String username;

    private String customerName;

    private String customerEmail;

    private List<OrderItemResponse> items;

    private BigDecimal totalAmount;

    private BigDecimal totalPrice;

    private OrderStatus status;

    private String orderStatus;

    private String shippingAddress;

    private String paymentMethod;

    private String phoneNumber;

    private String shippingMethod;

    private String note;

    private LocalDateTime createdAt;
}
