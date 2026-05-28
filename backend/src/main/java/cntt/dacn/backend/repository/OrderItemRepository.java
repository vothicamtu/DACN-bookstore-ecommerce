package cntt.dacn.backend.repository;

import cntt.dacn.backend.entity.Order;
import cntt.dacn.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);
}