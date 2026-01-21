package ma.nextstepest.auth_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserInfoResponse {
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String major;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;

    private String bio;
    private String username;
    private String ImageURL;
}
