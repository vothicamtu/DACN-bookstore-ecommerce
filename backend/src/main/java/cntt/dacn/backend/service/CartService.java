package cntt.dacn.backend.service;
import cntt.dacn.backend.dto.request.AddToCartRequest;
import cntt.dacn.backend.dto.request.UpdateCartItemRequest;
import cntt.dacn.backend.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart();

    CartResponse addToCart(
            AddToCartRequest request
    );

    CartResponse updateCartItem(
            UpdateCartItemRequest request
    );

    void removeCartItem(Long cartItemId);

    void clearCart();
}