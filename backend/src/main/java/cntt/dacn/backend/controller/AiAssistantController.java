package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.AiChatRequest;
import cntt.dacn.backend.dto.response.AiChatResponse;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.service.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai-assistant")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @Valid @RequestBody AiChatRequest request
    ) {
        AiChatResponse response = aiAssistantService.chat(request);

        return ResponseEntity.ok(
                ApiResponse.<AiChatResponse>builder()
                        .success(true)
                        .message("AI assistant response generated")
                        .data(response)
                        .build()
        );
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(
            @Valid @RequestBody AiChatRequest request
    ) {
        SseEmitter emitter = new SseEmitter(30000L);
        AiChatResponse response = aiAssistantService.chat(request);

        try {
            emitter.send(SseEmitter.event().name("message").data(response));
            emitter.complete();
        } catch (IOException ex) {
            emitter.completeWithError(ex);
        }

        return emitter;
    }
}
