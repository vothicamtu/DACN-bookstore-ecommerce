package cntt.dacn.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String username;
    private String role;     // Sẽ map từ ROLE_ADMIN / ROLE_USER sang dạng hiển thị sạch
    private String status;   // Trả ra chuỗi "Hoạt động" hoặc "Ngừng hoạt động" cho Frontend dễ render
}