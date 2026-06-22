package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.LoginRequest;
import cntt.dacn.backend.dto.request.RegisterRequest;
import cntt.dacn.backend.dto.response.AuthResponse;
import cntt.dacn.backend.entity.Role;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.repository.UserRepository;
import cntt.dacn.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Test
    void registerEncodesPasswordBeforeSaving() {
        AuthServiceImpl service = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil);
        RegisterRequest request = registerRequest();

        when(userRepository.findByUsername("reader")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("reader@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("$2a$encoded");

        service.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("$2a$encoded", userCaptor.getValue().getPassword());
        assertEquals(Role.USER, userCaptor.getValue().getRole());
    }

    @Test
    void loginReturnsJwtAndUpgradesLegacyPlaintextPassword() {
        AuthServiceImpl service = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil);
        LoginRequest request = loginRequest("reader", "secret123");
        User user = user("secret123");

        when(userRepository.findByUsernameOrEmail("reader", "reader"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.encode("secret123")).thenReturn("$2a$upgraded");
        when(jwtUtil.generateJwtToken(any())).thenReturn("jwt-token");

        AuthResponse response = service.login(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals("reader", response.getUsername());
        assertEquals("$2a$upgraded", user.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    void loginAcceptsBcryptPasswordWithoutRewritingIt() {
        AuthServiceImpl service = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil);
        LoginRequest request = loginRequest("reader@example.com", "secret123");
        User user = user("$2a$10$abcdefghijklmnopqrstuv12345678901234567890123456789");

        when(userRepository.findByUsernameOrEmail("reader@example.com", "reader@example.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", user.getPassword())).thenReturn(true);
        when(jwtUtil.generateJwtToken(any())).thenReturn("jwt-token");

        AuthResponse response = service.login(request);

        assertEquals("jwt-token", response.getToken());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginRejectsWrongPassword() {
        AuthServiceImpl service = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil);
        LoginRequest request = loginRequest("reader", "wrong-password");

        when(userRepository.findByUsernameOrEmail("reader", "reader"))
                .thenReturn(Optional.of(user("secret123")));

        assertThrows(BadCredentialsException.class, () -> service.login(request));
    }

    private RegisterRequest registerRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Book Reader");
        request.setUsername("reader");
        request.setEmail("reader@example.com");
        request.setPassword("secret123");
        request.setConfirmPassword("secret123");
        return request;
    }

    private LoginRequest loginRequest(String usernameOrEmail, String password) {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail(usernameOrEmail);
        request.setPassword(password);
        return request;
    }

    private User user(String password) {
        return User.builder()
                .id(1L)
                .fullName("Book Reader")
                .username("reader")
                .email("reader@example.com")
                .password(password)
                .role(Role.USER)
                .status(true)
                .build();
    }
}
