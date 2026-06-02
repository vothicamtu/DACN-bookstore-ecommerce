package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.CreateOrderRequest;
import cntt.dacn.backend.dto.request.OrderStatusUpdateRequest;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.OrderPageResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.dto.response.OrderReviewItemResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import cntt.dacn.backend.entity.OrderStatus;
import cntt.dacn.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderResponse response = orderService.createOrder(request);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order created successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public OrderPageResponse getOrders(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return orderService.getOrders(userId, status, page, size);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId
    ) {
        OrderResponse response = orderService.getOrderById(orderId);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<OrderResponse> response = orderService.getMyOrders(page, size);

        return ResponseEntity.ok(
                ApiResponse.<PagedResponse<OrderResponse>>builder()
                        .success(true)
                        .message("Orders retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        OrderResponse response = orderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order status updated")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{orderId}/review-items")
    public ResponseEntity<ApiResponse<List<OrderReviewItemResponse>>> getReviewItems(
            @PathVariable Long orderId
    ) {
        List<OrderReviewItemResponse> response = orderService.getReviewItems(orderId);

        return ResponseEntity.ok(
                ApiResponse.<List<OrderReviewItemResponse>>builder()
                        .success(true)
                        .message("Review items retrieved successfully")
                        .data(response)
                        .build()
        );
    }
}
