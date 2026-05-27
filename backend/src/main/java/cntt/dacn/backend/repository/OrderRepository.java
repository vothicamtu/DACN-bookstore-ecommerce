package cntt.dacn.backend.repository;

import cntt.dacn.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    long countByOrderStatus(Order.OrderStatus orderStatus);
}
