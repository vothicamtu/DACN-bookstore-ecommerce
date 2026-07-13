package cntt.dacn.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Username/email is required")
    private String usernameOrEmail;
}