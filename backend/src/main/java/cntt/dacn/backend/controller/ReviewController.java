package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.CreateReviewRequest;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.ReviewResponse;
import cntt.dacn.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewResponse response = reviewService.createReview(request);

        return ResponseEntity.ok(
                ApiResponse.<ReviewResponse>builder()
                        .success(true)
                        .message("Review created successfully")
                        .data(response)
                        .build()
        );
    }
}
