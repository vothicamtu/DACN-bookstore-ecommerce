package cntt.dacn.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AiChatResponse {

    private String sessionId;

    private String messageId;

    private String intent;

    private String answer;

    private Boolean needsClarification;

    private List<String> suggestions;

    private List<AiProductSuggestionResponse> products;

    private List<AiChatMessageResponse> history;

    private LocalDateTime createdAt;
}
