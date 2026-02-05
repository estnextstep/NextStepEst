package ma.nextstepest.qa_service.dto;

import lombok.Data;

@Data
public class AnswerDto {
    private String content;

    private Integer authorId;

    private Integer questionId;
}
