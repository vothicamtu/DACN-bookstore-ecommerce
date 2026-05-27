package dacn.cntt.backend.dto.response;

import cntt.dacn.backend.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private String type = "Bearer";

    private Long userId;

    private String username;

    private String email;

    private Role role;
}