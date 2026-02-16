package ma.nextstepest.qa_service.dto;

import lombok.Data;

@Data
public class MessageResponse {
    private boolean success = true;
    private String message;
}
