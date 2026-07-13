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

    public static BookResponse mapToBookResponse(Book book) {

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

                .categoryId(

                        book.getCategory() != null
                                ? book.getCategory()
                                .getId()
                                : null
                )

                .categoryName(

                        book.getCategory() != null
                                ? book.getCategory()
                                .getCategoryName()
                                : null
                )

                .authorId(

                        book.getAuthor() != null
                                ? book.getAuthor()
                                .getId()
                                : null
                )

                .authorName(

                        book.getAuthor() != null
                                ? book.getAuthor()
                                .getAuthorName()
                                : null
                )

                .publisherId(

                        book.getPublisher() != null
                                ? book.getPublisher()
                                .getId()
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
                .bookId(orderItem.getBook().getId())
                .title(orderItem.getBook().getTitle())
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
                .username(order.getUser().getUsername())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .shippingMethod(order.getShippingMethod())
                .paymentMethod(order.getPaymentMethod())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .build();
    }
}