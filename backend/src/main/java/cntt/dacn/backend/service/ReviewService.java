package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.request.CreateReviewRequest;
import cntt.dacn.backend.dto.response.ReviewResponse;

public interface ReviewService {

    ReviewResponse createReview(CreateReviewRequest request);
}
