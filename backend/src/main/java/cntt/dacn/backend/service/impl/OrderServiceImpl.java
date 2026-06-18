package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.CreateOrderRequest;
import cntt.dacn.backend.dto.request.OrderStatusUpdateRequest;
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
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .shippingMethod(request.getShippingMethod())
                .paymentMethod(request.getPaymentMethod())
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
}
