package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class DeleteAnswerRequest {
    private Integer authorId;

    private Integer answerId;
}
