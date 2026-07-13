package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.UserResponse;
import cntt.dacn.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5176", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();

        // Sử dụng Builder đi kèm với các trường chuẩn: success, message, data
        ApiResponse<List<UserResponse>> response = ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .message("Tải danh sách tài khoản thành công!")
                .data(users) // Đổi từ .result() thành .data() cho đúng DTO của bạn
                .build();

        return ResponseEntity.ok(response);
    }
}