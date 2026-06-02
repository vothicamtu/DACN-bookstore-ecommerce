package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.CreateReviewRequest;
import cntt.dacn.backend.dto.response.ReviewResponse;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.entity.Order;
import cntt.dacn.backend.entity.OrderItem;
import cntt.dacn.backend.entity.OrderStatus;
import cntt.dacn.backend.entity.Review;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.exception.BadRequestException;
import cntt.dacn.backend.exception.ResourceNotFoundException;
import cntt.dacn.backend.repository.OrderItemRepository;
import cntt.dacn.backend.repository.ReviewRepository;
import cntt.dacn.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {

        OrderItem orderItem =
                orderItemRepository.findById(request.getOrderItemId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Đơn hàng không tìm thấy"
                                )
                        );

        Order order = orderItem.getOrder();
        if (order == null || order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Chỉ đơn hàng đã giao mới có thể đánh giá");
        }

        User user = order.getUser();
        Book book = orderItem.getBook();
        if (user == null || book == null) {
            throw new BadRequestException("Đơn hàng không hợp lệ");
        }

        if (reviewRepository.existsByUserAndBook(user, book)) {
            throw new BadRequestException("Sản phẩm này đã được đánh giá");
        }

        Review review =
                Review.builder()
                        .user(user)
                        .book(book)
                        .rating(request.getRating())
                        .comment(request.getComment())
                        .build();

        Review savedReview = reviewRepository.save(review);

        return ReviewResponse.builder()
                .id(savedReview.getId())
                .userId(user.getId())
                .bookId(book.getId())
                .bookTitle(book.getTitle())
                .rating(savedReview.getRating())
                .comment(savedReview.getComment())
                .createdAt(savedReview.getCreatedAt())
                .build();
    }
}
