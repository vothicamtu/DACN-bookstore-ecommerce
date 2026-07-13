package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.response.UserResponse;
import cntt.dacn.backend.entity.User;
import cntt.dacn.backend.repository.UserRepository;
import cntt.dacn.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
            // Đọc Role từ DB Enum (ROLE_ADMIN, ROLE_USER) đổi thành chữ hiển thị đẹp
            String displayRole = "Độc giả";
            if (user.getRole() != null && user.getRole().name().equals("ROLE_ADMIN")) {
                displayRole = "Quản trị viên";
            }

            // Đọc trạng thái status (Boolean) từ DB
            String displayStatus = (user.getStatus() != null && user.getStatus()) ? "Hoạt động" : "Ngừng hoạt động";

            return UserResponse.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .role(displayRole)
                    .status(displayStatus)
                    .build();
        }).collect(Collectors.toList());
    }
}