package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.AiChatResponse;

public interface HistoryService {

    void record(AiChatResponse response);
}
