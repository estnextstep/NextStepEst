package ma.nextstepest.qa_service.dto;

import lombok.Data;


import java.util.List;
@Data
public class QuestionInfoDto {

    private QuestionDto question;
    private List<AnswerResponse> answers;

    private int totalPages;
    private long totalElements;
}
