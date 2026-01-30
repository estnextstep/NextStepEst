package ma.nextstepest.qa_service.dto;

import lombok.Data;

@Data
public class QuestionRequest {
    private Integer authorId;
    private String content;
}
