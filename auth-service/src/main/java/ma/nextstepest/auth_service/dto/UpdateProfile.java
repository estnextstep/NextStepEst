package ma.nextstepest.auth_service.dto;

import lombok.Data;

@Data
public class UpdateProfile {
    private String firstname;
    private String lastname;
    private String role;
    private String major;
    private String bio;
    private String linkedIn;
}
