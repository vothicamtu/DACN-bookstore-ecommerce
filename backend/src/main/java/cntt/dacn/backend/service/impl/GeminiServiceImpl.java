package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.service.GeminiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Optional;

@Slf4j
@Service
public class GeminiServiceImpl implements GeminiService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;
    private final String apiBaseUrl;
    private final int timeoutSeconds;

    public GeminiServiceImpl(
            @Value("${gemini.api.key:${GEMINI_API_KEY:}}") String apiKey,
            @Value("${gemini.model:gemini-3.5-flash}") String model,
            @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com}") String apiBaseUrl,
            @Value("${gemini.timeout.seconds:20}") int timeoutSeconds
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.apiBaseUrl = apiBaseUrl;
        this.timeoutSeconds = timeoutSeconds;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
    }

    @Override
    public Optional<String> generateAnswer(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Gemini API key is not configured. Falling back to local recommendation answer.");
            return Optional.empty();
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(buildGenerateContentUrl()))
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(buildRequestBody(prompt)))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Gemini API failed with status {}: {}", response.statusCode(), response.body());
                return Optional.empty();
            }

            return extractOutputText(response.body());
        } catch (Exception ex) {
            log.warn("Gemini API request failed. Falling back to local recommendation answer.", ex);
            return Optional.empty();
        }
    }

    private Optional<String> extractOutputText(String responseBody) throws Exception {
        JsonNode parts = objectMapper.readTree(responseBody)
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts");
        StringBuilder builder = new StringBuilder();
        for (JsonNode part : parts) {
            String text = part.path("text").asText("");
            if (!text.isBlank()) {
                builder.append(text);
            }
        }
        return builder.isEmpty() ? Optional.empty() : Optional.of(builder.toString());
    }

    private String buildRequestBody(String prompt) throws Exception {
        ObjectNode root = objectMapper.createObjectNode();
        ArrayNode contents = root.putArray("contents");
        ObjectNode content = contents.addObject();
        content.put("role", "user");
        content.putArray("parts").addObject().put("text", prompt == null ? "" : prompt);
        return objectMapper.writeValueAsString(root);
    }

    private String buildGenerateContentUrl() {
        String normalizedBaseUrl = apiBaseUrl.replaceAll("/+$", "");
        return normalizedBaseUrl + "/v1beta/models/" + model + ":generateContent";
    }
}
