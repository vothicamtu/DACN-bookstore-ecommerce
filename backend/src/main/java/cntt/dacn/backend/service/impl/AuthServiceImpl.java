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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        String jwt =
                jwtUtil.generateJwtToken(authentication);

        User user =
                userRepository
                        .findByUsername(request.getUsername())
                        .orElseThrow();

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

        if (userRepository.existsByUsername(
                request.getUsername()
        )) {

            throw new BadRequestException(
                    "Username already exists"
            );
        }

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new BadRequestException(
                    "Email already exists"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.ROLE_USER)
                .enabled(true)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }
}