package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.OrderItemResponse;
import cntt.dacn.backend.dto.response.OrderPageResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.entity.Order;
import cntt.dacn.backend.entity.OrderItem;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public OrderPageResponse getOrders(Long userId, Order.OrderStatus status, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Order> orders;

        if (userId != null && status != null) {
            orders = orderRepository.findByUserIdAndOrderStatus(userId, status, pageable);
        } else if (userId != null) {
            orders = orderRepository.findByUserId(userId, pageable);
        } else if (status != null) {
            orders = orderRepository.findByOrderStatus(status, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        List<OrderResponse> items = new ArrayList<>();

        for (Order order : orders.getContent()) {
            items.add(toOrderResponse(order));
        }

        long processingItems = orderRepository.countByOrderStatus(Order.OrderStatus.PENDING)
                + orderRepository.countByOrderStatus(Order.OrderStatus.CONFIRMED)
                + orderRepository.countByOrderStatus(Order.OrderStatus.SHIPPING);

        return new OrderPageResponse(
                items,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalPages(),
                orders.getTotalElements(),
                processingItems
        );
    }
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isEmpty()) {
            throw new EntityNotFoundException("Order not found: " + id);
        }

        return toOrderResponse(orderOptional.get());
    }

    private OrderResponse toOrderResponse(Order order) {
        User user = order.getUser();
        List<OrderItemResponse> items = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            items.add(toOrderItemResponse(item));
        }

        return new OrderResponse(
                order.getId(),
                user != null ? user.getId() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getEmail() : null,
                order.getTotalPrice(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getOrderStatus() != null ? order.getOrderStatus().name() : null,
                order.getCreatedAt(),
                items
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        Book book = item.getBook();

        return new OrderItemResponse(
                item.getId(),
                book != null ? book.getId() : null,
                book != null ? book.getTitle() : null,
                book != null ? book.getImageUrl() : null,
                item.getQuantity(),
                item.getPrice()
        );
    }
}
