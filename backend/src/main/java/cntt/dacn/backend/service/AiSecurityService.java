package cntt.dacn.backend.service;

public interface AiSecurityService {

    boolean isRateLimited(String sessionId);

    boolean isUnsafe(String message);

    String sanitize(String message);
}
