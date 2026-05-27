package cntt.dacn.backend.service;
import cntt.dacn.backend.dto.request.CreateOrderRequest;
import cntt.dacn.backend.dto.request.OrderStatusUpdateRequest;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.dto.response.PagedResponse;

public interface OrderService {

    OrderResponse createOrder(
            CreateOrderRequest request
    );

    OrderResponse getOrderById(Long orderId);

    PagedResponse<OrderResponse> getMyOrders(
            int page,
            int size
    );

    OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatusUpdateRequest request
    );
}