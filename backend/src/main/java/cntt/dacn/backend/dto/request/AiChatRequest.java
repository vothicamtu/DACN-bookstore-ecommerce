package cntt.dacn.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiChatRequest {

    @Size(max = 80)
    private String sessionId;

    @NotBlank
    @Size(max = 1000)
    private String message;

    @Size(max = 300)
    private String pageUrl;

    private Long currentBookId;
}
