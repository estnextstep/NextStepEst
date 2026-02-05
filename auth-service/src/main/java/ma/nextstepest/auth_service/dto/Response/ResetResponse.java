package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

@Data
public class ResetResponse {
    private Integer user_id;
    private String reset_token;
}