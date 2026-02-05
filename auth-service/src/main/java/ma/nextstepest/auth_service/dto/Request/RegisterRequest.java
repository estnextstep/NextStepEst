package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String role;
    private String username;
}
