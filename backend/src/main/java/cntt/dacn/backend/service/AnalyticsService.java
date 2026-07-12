package cntt.dacn.backend.service;

public interface AnalyticsService {

    void logChat(String sessionId, String intent, long latencyMs, long searchTimeMs, int booksReturned);
}
