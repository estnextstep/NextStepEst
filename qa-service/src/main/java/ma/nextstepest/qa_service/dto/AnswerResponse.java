package ma.nextstepest.qa_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerResponse {

    private Integer id;

    private String content;

    private Integer authorId;

    private Integer questionId;
}
