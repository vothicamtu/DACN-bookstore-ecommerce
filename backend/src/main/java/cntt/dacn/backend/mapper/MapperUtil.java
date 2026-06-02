package cntt.dacn.backend.mapper;

import cntt.dacn.backend.dto.response.BookResponse;
import cntt.dacn.backend.dto.response.CartItemResponse;
import cntt.dacn.backend.dto.response.CartResponse;
import cntt.dacn.backend.dto.response.OrderItemResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.entity.Cart;
import cntt.dacn.backend.entity.CartItem;
import cntt.dacn.backend.entity.Order;
import cntt.dacn.backend.entity.OrderItem;

import java.math.BigDecimal;
import java.util.List;

public class MapperUtil {

    private MapperUtil() {
    }

    public static BookResponse mapToBookResponse( Book book) {

    return BookResponse.builder()

            .id(book.getId())

            .title(book.getTitle())

            .imageUrl(book.getImageUrl())

            .description(book.getDescription())

            .price(book.getPrice())

            .discountPercent(
                    book.getDiscountPercent()
            )

            .stock(book.getStock())

            .translator(book.getTranslator())

            .pageCount(book.getPageCount())

            .size(book.getSize())

            .publishDate(book.getPublishDate())

            .averageRating(
                    book.getAverageRating()
            )

            .soldCount(book.getSoldCount())

            .categoryName(

                    book.getCategory() != null
                            ? book.getCategory()
                            .getCategoryName()
                            : null
            )

            .authorName(

                    book.getAuthor() != null
                            ? book.getAuthor()
                            .getAuthorName()
                            : null
            )

            .publisherName(

                    book.getPublisher() != null
                            ? book.getPublisher()
                            .getPublisherName()
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

    public static CartResponse mapToCartResponse(
            Cart cart
    ) {

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
                .id(orderItem.getId())
                .bookId(orderItem.getBook().getId())
                .title(orderItem.getBook().getTitle())
                .bookTitle(orderItem.getBook().getTitle())
                .imageUrl(orderItem.getBook().getImageUrl())
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
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .username(order.getUser() != null ? order.getUser().getUsername() : null)
                .customerName(order.getUser() != null ? order.getUser().getFullName() : null)
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .items(items)
                .totalAmount(order.getTotalAmount())
                .totalPrice(order.getTotalAmount())
                .status(order.getStatus())
                .orderStatus(order.getStatus() != null ? order.getStatus().name() : null)
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .phoneNumber(order.getPhoneNumber())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
