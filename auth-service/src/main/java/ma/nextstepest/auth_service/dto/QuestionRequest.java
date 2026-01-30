package ma.nextstepest.auth_service.dto;

import lombok.Data;

@Data
public class QuestionRequest {
    private Integer authorId;
    private String content;
}
