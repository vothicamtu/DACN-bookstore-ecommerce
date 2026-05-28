package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.CreateOrderRequest;
import cntt.dacn.backend.dto.request.OrderStatusUpdateRequest;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import cntt.dacn.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>>
    createOrder(
            @Valid @RequestBody
            CreateOrderRequest request
    ) {

        OrderResponse response =
                orderService.createOrder(request);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order created successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>>
    getOrderById(
            @PathVariable Long orderId
    ) {

        OrderResponse response =
                orderService.getOrderById(orderId);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>>
    getMyOrders(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        PagedResponse<OrderResponse> response =
                orderService.getMyOrders(
                        page,
                        size
                );

        return ResponseEntity.ok(
                ApiResponse.<PagedResponse<OrderResponse>>builder()
                        .success(true)
                        .message("Orders retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>>
    updateOrderStatus(

            @PathVariable Long orderId,

            @Valid @RequestBody
            OrderStatusUpdateRequest request
    ) {

        OrderResponse response =
                orderService.updateOrderStatus(
                        orderId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order status updated")
                        .data(response)
                        .build()
        );
    }
}