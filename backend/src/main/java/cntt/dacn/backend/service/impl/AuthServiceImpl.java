package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.LoginRequest;
import cntt.dacn.backend.dto.request.RegisterRequest;
import cntt.dacn.backend.dto.response.AuthResponse;
import cntt.dacn.backend.entity.Role;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.exception.BadRequestException;
import cntt.dacn.backend.exception.UnauthorizedException;
import cntt.dacn.backend.repository.UserRepository;
import cntt.dacn.backend.security.JwtUtil;
import cntt.dacn.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (Boolean.FALSE.equals(user.getStatus())) {
            throw new UnauthorizedException("Tài khoản đang bị khóa hoặc ngừng kích hoạt");
        }

        String storedPassword = user.getPassword();
        boolean bcryptPassword = storedPassword != null && storedPassword.matches("^\\$2[ayb]\\$.+");
        boolean passwordMatches = bcryptPassword
                ? passwordEncoder.matches(request.getPassword(), storedPassword)
                : storedPassword != null && storedPassword.equals(request.getPassword());

        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Upgrade accounts created by the legacy plaintext registration flow.
        if (!bcryptPassword) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        UserDetailsImpl principal = UserDetailsImpl.build(user);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );
        String jwt = jwtUtil.generateJwtToken(authentication);

        // 3. Trả về AuthResponse (Nếu Builder vẫn đỏ do Lombok, bạn hãy dùng New AuthResponse(...) truyền thống)
        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public String register(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp!");
        }

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

        return "Đăng ký tài khoản thành công!";
    }
}
