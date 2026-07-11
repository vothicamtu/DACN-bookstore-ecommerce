package cntt.dacn.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AiChatMessageResponse {

    private String role;

    private String content;

    private LocalDateTime timestamp;
}
