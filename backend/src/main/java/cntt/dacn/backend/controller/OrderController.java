package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.response.OrderPageResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.entity.Order;
import cntt.dacn.backend.service.OrderService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public OrderPageResponse getOrders(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return orderService.getOrders(userId, status, page, size);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
}
