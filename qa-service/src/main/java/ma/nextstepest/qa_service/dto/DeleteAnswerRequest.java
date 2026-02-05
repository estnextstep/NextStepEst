package ma.nextstepest.qa_service.dto;

import lombok.Data;

@Data
public class DeleteAnswerRequest {
    private Integer authorId;

    private Integer answerId;
}
