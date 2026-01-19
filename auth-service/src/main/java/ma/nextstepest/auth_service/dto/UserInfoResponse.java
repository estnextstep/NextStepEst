package ma.nextstepest.auth_service.dto;

import lombok.Data;

@Data
public class UserInfoResponse {
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
