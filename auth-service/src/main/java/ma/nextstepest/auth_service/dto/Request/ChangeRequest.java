package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class ChangeRequest {
    private Integer user_id;
    private String reset_token;
    private String new_password;
    private String confirm_password;
}