package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.AddToCartRequest;
import cntt.dacn.backend.dto.request.UpdateCartItemRequest;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.CartResponse;
import cntt.dacn.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>>
    getCart() {

        CartResponse response =
                cartService.getCart();

        return ResponseEntity.ok(
                ApiResponse.<CartResponse>builder()
                        .success(true)
                        .message("Cart retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>>
    addToCart(
            @Valid @RequestBody
            AddToCartRequest request
    ) {

        CartResponse response =
                cartService.addToCart(request);

        return ResponseEntity.ok(
                ApiResponse.<CartResponse>builder()
                        .success(true)
                        .message("Book added to cart")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>>
    updateCartItem(
            @Valid @RequestBody
            UpdateCartItemRequest request
    ) {

        CartResponse response =
                cartService.updateCartItem(request);

        return ResponseEntity.ok(
                ApiResponse.<CartResponse>builder()
                        .success(true)
                        .message("Cart updated successfully")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<String>>
    removeCartItem(
            @PathVariable Long cartItemId
    ) {

        cartService.removeCartItem(cartItemId);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Cart item removed")
                        .data(null)
                        .build()
        );
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>>
    clearCart() {

        cartService.clearCart();

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Cart cleared")
                        .data(null)
                        .build()
        );
    }
}