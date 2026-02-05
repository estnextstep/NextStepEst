package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;

}
