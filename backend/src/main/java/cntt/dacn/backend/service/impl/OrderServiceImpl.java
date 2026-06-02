package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.CreateOrderRequest;
import cntt.dacn.backend.dto.request.OrderStatusUpdateRequest;
import cntt.dacn.backend.dto.response.OrderPageResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import cntt.dacn.backend.entity.*;
import cntt.dacn.backend.exception.ResourceNotFoundException;
import cntt.dacn.backend.repository.*;
import cntt.dacn.backend.service.OrderService;
import cntt.dacn.backend.mapper.MapperUtil;
import cntt.dacn.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    @Override
    public OrderResponse createOrder(
            CreateOrderRequest request
    ) {

        Long userId =
                SecurityUtil.getCurrentUserId();

        User user =
                userRepository.findById(userId)
                        .orElseThrow();

        Cart cart =
                cartRepository.findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart not found"
                                )
                        );

        List<CartItem> cartItems =
                cartItemRepository.findByCart(cart);

        if (cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }

        BigDecimal totalAmount =
                cartItems.stream()
                        .map(item ->
                                item.getPrice().multiply(
                                        BigDecimal.valueOf(
                                                item.getQuantity()
                                        )
                                )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .shippingAddress(
                        request.getShippingAddress()
                )
                .phoneNumber(
                        request.getPhoneNumber()
                )
                .note(request.getNote())
                .status(OrderStatus.PENDING)
                .orderItems(new ArrayList<>())
                .build();

        Order savedOrder =
                orderRepository.save(order);

        List<OrderItem> orderItems =
                cartItems.stream()
                        .map(cartItem ->
                                OrderItem.builder()
                                        .order(savedOrder)
                                        .book(cartItem.getBook())
                                        .quantity(
                                                cartItem.getQuantity()
                                        )
                                        .price(
                                                cartItem.getPrice()
                                        )
                                        .build()
                        ).toList();

        orderItemRepository.saveAll(orderItems);

        cartItemRepository.deleteByCart(cart);

        savedOrder.setOrderItems(orderItems);

        return MapperUtil.mapToOrderResponse(
                savedOrder
        );
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );

        return MapperUtil.mapToOrderResponse(order);
    }

    @Override
    public PagedResponse<OrderResponse> getMyOrders(
            int page,
            int size
    ) {

        Long userId =
                SecurityUtil.getCurrentUserId();

        User user =
                userRepository.findById(userId)
                        .orElseThrow();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("createdAt")
                                .descending()
                );

        Page<Order> orders =
                orderRepository.findByUser(
                        user,
                        pageable
                );

        List<OrderResponse> content =
                orders.getContent()
                        .stream()
                        .map(MapperUtil::mapToOrderResponse)
                        .toList();

        return PagedResponse.<OrderResponse>builder()
                .content(content)
                .page(orders.getNumber())
                .size(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .last(orders.isLast())
                .build();
    }

    @Override
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatusUpdateRequest request
    ) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );

        order.setStatus(request.getStatus());

        orderRepository.save(order);

        return MapperUtil.mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderPageResponse getOrders(
            Long userId,
            OrderStatus status,
            int page,
            int size
    ) {

        Pageable pageable =
                PageRequest.of(
                        Math.max(page, 0),
                        Math.min(Math.max(size, 1), 50),
                        Sort.by("createdAt").descending()
                );

        Page<Order> orders;

        if (userId != null && status != null) {
            orders = orderRepository.findByUserIdAndStatus(userId, status, pageable);
        } else if (userId != null) {
            orders = orderRepository.findByUserId(userId, pageable);
        } else if (status != null) {
            orders = orderRepository.findByStatus(status, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        List<OrderResponse> items =
                orders.getContent()
                        .stream()
                        .map(MapperUtil::mapToOrderResponse)
                        .toList();

        long processingItems =
                orderRepository.countByStatus(OrderStatus.PENDING)
                        + orderRepository.countByStatus(OrderStatus.CONFIRMED)
                        + orderRepository.countByStatus(OrderStatus.SHIPPING);

        return new OrderPageResponse(
                items,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalPages(),
                orders.getTotalElements(),
                processingItems
        );
    }
}
