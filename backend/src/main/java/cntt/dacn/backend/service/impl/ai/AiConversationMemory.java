package cntt.dacn.backend.service.impl.ai;

import cntt.dacn.backend.dto.response.AiChatMessageResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AiConversationMemory {

    private String sessionId;

    private String goal;

    private BigDecimal budget;

    private String ageGroup;

    private String language;

    private String favoriteAuthor;

    private String category;

    private String currentTopic;

    private String currentBookTitle;

    private String lastUserQuestion;

    private final List<AiChatMessageResponse> messages = new ArrayList<>();
}
