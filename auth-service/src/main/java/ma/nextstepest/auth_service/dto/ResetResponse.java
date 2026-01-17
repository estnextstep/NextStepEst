package ma.nextstepest.auth_service.dto;

import lombok.Data;

@Data
public class ResetResponse {
    private Integer user_id;
    private String reset_token;
}