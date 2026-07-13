package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.UserResponse;
import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
}