package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class ChangePasswordReq {

    private String password;
    private String newpassword;
    private String confirmnewpassword;


}
