package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class AnswerRequest {
    private String content;

    private Integer authorId;

    private Integer questionId;
}
