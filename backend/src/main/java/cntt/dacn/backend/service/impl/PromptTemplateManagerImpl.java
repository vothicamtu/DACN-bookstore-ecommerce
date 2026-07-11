package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.service.PromptTemplateManager;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PromptTemplateManagerImpl implements PromptTemplateManager {

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    @Override
    public String getTemplate(String name) {
        return cache.computeIfAbsent(name, this::readTemplate);
    }

    private String readTemplate(String name) {
        try {
            ClassPathResource resource = new ClassPathResource("prompts/" + name + ".txt");
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException ex) {
            return "";
        }
    }
}
