package ma.nextstepest.auth_service.dto;

import lombok.Data;

@Data
public class ResetRequest {
    private String email;
    private Integer OTP;
}