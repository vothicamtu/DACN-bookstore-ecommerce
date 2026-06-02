package cntt.dacn.backend.repository;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.entity.Cart;
import cntt.dacn.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart(Cart cart);

    Optional<CartItem> findByCartAndBook(
            Cart cart,
            Book book
    );

    void deleteByCart(Cart cart);
}