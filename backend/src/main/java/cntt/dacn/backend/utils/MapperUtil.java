package cntt.dacn.backend.util;

import cntt.dacn.backend.dto.response.*;
import cntt.dacn.backend.entity.*;

import java.math.BigDecimal;
import java.util.List;

public class MapperUtil {

    private MapperUtil() {
    }

    public static BookResponse mapToBookResponse(Book book) {

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .description(book.getDescription())
                .publisher(book.getPublisher())
                .publicationYear(book.getPublicationYear())
                .stockQuantity(book.getStockQuantity())
                .imageUrl(book.getImageUrl())
                .price(book.getPrice())
                .categoryName(
                        book.getCategory() != null
                                ? book.getCategory().getName()
                                : null
                )
                .build();
    }

    public static CartItemResponse mapToCartItemResponse(
            CartItem cartItem
    ) {

        BigDecimal totalPrice =
                cartItem.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        cartItem.getQuantity()
                                )
                        );

        return CartItemResponse.builder()
                .cartItemId(cartItem.getId())
                .bookId(cartItem.getBook().getId())
                .title(cartItem.getBook().getTitle())
                .imageUrl(cartItem.getBook().getImageUrl())
                .price(cartItem.getPrice())
                .quantity(cartItem.getQuantity())
                .totalPrice(totalPrice)
                .build();
    }

    public static CartResponse mapToCartResponse(Cart cart) {

        List<CartItemResponse> items =
                cart.getCartItems()
                        .stream()
                        .map(MapperUtil::mapToCartItemResponse)
                        .toList();

        BigDecimal totalAmount =
                items.stream()
                        .map(CartItemResponse::getTotalPrice)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }

    public static OrderItemResponse mapToOrderItemResponse(
            OrderItem orderItem
    ) {

        BigDecimal totalPrice =
                orderItem.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        orderItem.getQuantity()
                                )
                        );

        return OrderItemResponse.builder()
                .orderItemId(orderItem.getId())
                .bookId(orderItem.getBook().getId())
                .title(orderItem.getBook().getTitle())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .totalPrice(totalPrice)
                .build();
    }

    public static OrderResponse mapToOrderResponse(
            Order order
    ) {

        List<OrderItemResponse> items =
                order.getOrderItems()
                        .stream()
                        .map(MapperUtil::mapToOrderItemResponse)
                        .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .username(order.getUser().getUsername())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .build();
    }
}