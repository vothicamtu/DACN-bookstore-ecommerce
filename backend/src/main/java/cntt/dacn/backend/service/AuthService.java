package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.request.LoginRequest;
import cntt.dacn.backend.dto.request.RegisterRequest;
import cntt.dacn.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    String register(RegisterRequest request);
}
