package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class QuestionRequest {
    private Integer authorId;
    private String title;
    private String content;
    private String keywords;
}
