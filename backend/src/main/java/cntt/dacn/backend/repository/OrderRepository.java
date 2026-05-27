package cntt.dacn.backend.repository;

import cntt.dacn.backend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserId(Long userId, Pageable pageable);

    Page<Order> findByOrderStatus(Order.OrderStatus orderStatus, Pageable pageable);

    Page<Order> findByUserIdAndOrderStatus(
            Long userId,
            Order.OrderStatus orderStatus,
            Pageable pageable
    );

    long countByOrderStatus(Order.OrderStatus orderStatus);
}