package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class DeleteQuestionRequest {
    private  Integer authorId;
    private  Integer questionId;
}
