package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.response.AiChatResponse;
import cntt.dacn.backend.service.HistoryService;
import org.springframework.stereotype.Service;

@Service
public class HistoryServiceImpl implements HistoryService {

    @Override
    public void record(AiChatResponse response) {
        // Reserved for persistent chat history when the database migration is added.
    }
}
