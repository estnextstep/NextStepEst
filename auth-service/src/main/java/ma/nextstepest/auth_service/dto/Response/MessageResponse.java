package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

@Data
public class MessageResponse {
    private boolean success = true;
    private String message;
}
