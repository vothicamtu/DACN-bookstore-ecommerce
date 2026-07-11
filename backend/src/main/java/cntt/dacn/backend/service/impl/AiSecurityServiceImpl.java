package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.service.AiSecurityService;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class AiSecurityServiceImpl implements AiSecurityService {

    private static final int MAX_REQUESTS_PER_MINUTE = 20;
    private static final long WINDOW_SECONDS = 60;
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");

    private final Map<String, Deque<Long>> requests = new ConcurrentHashMap<>();

    @Override
    public boolean isRateLimited(String sessionId) {
        long now = Instant.now().getEpochSecond();
        Deque<Long> timestamps = requests.computeIfAbsent(sessionId, key -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_SECONDS) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= MAX_REQUESTS_PER_MINUTE) {
                return true;
            }

            timestamps.addLast(now);
            return false;
        }
    }

    @Override
    public boolean isUnsafe(String message) {
        String normalized = normalize(message);
        return normalized.contains("ignore previous")
                || normalized.contains("system prompt")
                || normalized.contains("api key")
                || normalized.contains("database password")
                || normalized.contains("source code")
                || normalized.contains("environment variable")
                || normalized.contains("jailbreak");
    }

    @Override
    public String sanitize(String message) {
        if (message == null) {
            return "";
        }

        String withoutHtml = HTML_TAG_PATTERN.matcher(message).replaceAll("");
        return withoutHtml.trim();
    }

    private String normalize(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
