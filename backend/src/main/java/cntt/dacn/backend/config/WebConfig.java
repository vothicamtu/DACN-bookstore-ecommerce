package cntt.dacn.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // XÓA DẤU "*" VÀ THAY BẰNG ĐỊA CHỈ CHÍNH XÁC CỦA FRONTEND
                .allowedOrigins("http://localhost:5176", "http://localhost:5173", "http://localhost:5174")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Vì dòng này là true nên không được dùng "*" ở allowedOrigins
    }
}