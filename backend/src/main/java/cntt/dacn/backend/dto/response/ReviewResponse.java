package cntt.dacn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;

    private Long userId;

    private Long bookId;

    private String bookTitle;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
}
