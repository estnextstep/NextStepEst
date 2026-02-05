package ma.nextstepest.auth_service.dto.Response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import ma.nextstepest.auth_service.dto.Request.ExperienceRequest;

import java.time.LocalDateTime;

@Builder
@Data
public class UserInfoResponse {
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String major;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;

    private String linkedIn;
    private String bio;
    private String username;
    private String ImageURL;
    private ExperienceRequest experienceRequest;
}
