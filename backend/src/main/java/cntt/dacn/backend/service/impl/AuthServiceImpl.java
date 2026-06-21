package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.LoginRequest;
import cntt.dacn.backend.dto.request.RegisterRequest;
import cntt.dacn.backend.dto.response.AuthResponse;
import cntt.dacn.backend.entity.Role;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.exception.BadRequestException;
import cntt.dacn.backend.repository.UserRepository;
import cntt.dacn.backend.security.JwtUtil;
import cntt.dacn.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {

        // 1. Thay đổi request.getUsername() thành request.getUsernameOrEmail() để khớp với DTO mới
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsernameOrEmail(),
                                request.getPassword()
                        )
                );

        String jwt = jwtUtil.generateJwtToken(authentication);

        // 2. Tìm kiếm User linh hoạt bằng cả Username hoặc Email để lấy dữ liệu build Response
        User user = userRepository
                .findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy thông tin người dùng"));

        // 3. Trả về AuthResponse (Nếu Builder vẫn đỏ do Lombok, bạn hãy dùng New AuthResponse(...) truyền thống)
        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public String register(RegisterRequest request) {

        // 4. Kiểm tra trùng lặp tài khoản trước khi lưu
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Tên đăng nhập (Username) này đã tồn tại!");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email này đã được đăng ký!");
        }

        // 5. Khởi tạo thực thể User, sửa Role thành Role.USER (khớp với file User.java)
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Sửa đổi từ ROLE_USER thành USER cho đúng Enum
                .status(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }
}