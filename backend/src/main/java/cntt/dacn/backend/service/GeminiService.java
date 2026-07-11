package cntt.dacn.backend.service;

import java.util.Optional;

public interface GeminiService {

    Optional<String> generateAnswer(String prompt);
}
