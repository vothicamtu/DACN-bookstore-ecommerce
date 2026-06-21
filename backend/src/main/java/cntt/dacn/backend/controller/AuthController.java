package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.LoginRequest;
import cntt.dacn.backend.dto.request.RegisterRequest;
import cntt.dacn.backend.entity.Role;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 1. Kiểm tra mật khẩu khớp nhau
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu xác nhận không khớp!"));
        }

        // 2. Kiểm tra trùng lặp Username
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập (Username) này đã tồn tại!"));
        }

        // 3. Kiểm tra trùng lặp Email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã được đăng ký!"));
        }

        // 4. Khởi tạo đối tượng User
        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .status(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Đăng ký tài khoản thành công!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Truy vấn tìm kiếm linh hoạt theo Username hoặc Email của người dùng nhập vào
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail());

        // Kiểm tra sự tồn tại tài khoản và đối chiếu mật khẩu
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Tên đăng nhập/Email hoặc mật khẩu không chính xác!"));
        }

        User user = userOpt.get();

        // Kiểm tra trạng thái tài khoản kích hoạt
        if (!user.getStatus()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Tài khoản của bạn đang bị khóa hoặc ngừng kích hoạt!"));
        }

        // Trả về thông tin phiên làm việc thành công
        return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công!",
                "user", Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole().toString()
                )
        ));
    }
}