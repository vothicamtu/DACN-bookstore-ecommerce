package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Override
    public void logChat(String sessionId, String intent, long latencyMs, long searchTimeMs, int booksReturned) {
        log.info(
                "ai_assistant sessionId={} intent={} latencyMs={} searchTimeMs={} booksReturned={}",
                sessionId,
                intent,
                latencyMs,
                searchTimeMs,
                booksReturned
        );
    }
}
