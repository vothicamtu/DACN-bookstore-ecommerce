package cntt.dacn.backend.service.impl;
import cntt.dacn.backend.dto.request.AddToCartRequest;
import cntt.dacn.backend.dto.request.UpdateCartItemRequest;
import cntt.dacn.backend.dto.response.CartResponse;
import cntt.dacn.backend.entity.*;
import cntt.dacn.backend.exception.ResourceNotFoundException;
import cntt.dacn.backend.repository.*;
import cntt.dacn.backend.service.CartService;
import cntt.dacn.backend.mapper.MapperUtil;
import cntt.dacn.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final BookRepository bookRepository;

    private final UserRepository userRepository;

    @Override
    public CartResponse getCart() {

        Cart cart = getUserCart();

        return MapperUtil.mapToCartResponse(cart);
    }

    @Override
    public CartResponse addToCart(
            AddToCartRequest request
    ) {

        Cart cart = getUserCart();

        Book book = bookRepository.findById(
                request.getBookId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Book not found"
                )
        );

        CartItem cartItem =
                cartItemRepository
                        .findByCartAndBook(cart, book)
                        .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(
                    cartItem.getQuantity()
                            + request.getQuantity()
            );

        } else {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(request.getQuantity())
                    .price(book.getPrice())
                    .build();
        }

        cartItemRepository.save(cartItem);

        return MapperUtil.mapToCartResponse(
                getUserCart()
        );
    }

    @Override
    public CartResponse updateCartItem(
            UpdateCartItemRequest request
    ) {

        CartItem cartItem =
                cartItemRepository.findById(
                        request.getCartItemId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found"
                        )
                );

        cartItem.setQuantity(request.getQuantity());

        cartItemRepository.save(cartItem);

        return MapperUtil.mapToCartResponse(
                getUserCart()
        );
    }

    @Override
    public void removeCartItem(Long cartItemId) {

        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    public void clearCart() {

        Cart cart = getUserCart();

        cartItemRepository.deleteByCart(cart);
    }

    private Cart getUserCart() {

        Long userId =
                SecurityUtil.getCurrentUserId();

        User user =
                userRepository.findById(userId)
                        .orElseThrow();

        return cartRepository.findByUser(user)
                .orElseGet(() -> {

                    Cart newCart = Cart.builder()
                            .user(user)
                            .cartItems(new ArrayList<>())
                            .build();

                    return cartRepository.save(newCart);
                });
    }
}