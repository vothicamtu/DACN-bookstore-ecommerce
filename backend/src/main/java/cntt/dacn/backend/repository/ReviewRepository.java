package cntt.dacn.backend.repository;

import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.entity.Review;
import cntt.dacn.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByUserAndBook(User user, Book book);
}
