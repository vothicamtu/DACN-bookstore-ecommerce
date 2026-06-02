package cntt.dacn.backend.repository;

import cntt.dacn.backend.entity.Cart;
import cntt.dacn.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository
        extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);
}