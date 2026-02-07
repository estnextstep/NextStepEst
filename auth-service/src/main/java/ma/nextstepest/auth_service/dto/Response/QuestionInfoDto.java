package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

import java.util.List;
@Data
public class QuestionInfoDto {

    private QuestionDto question;
    private List<AnswerResponse> answers;

    private int totalPages;
    private long totalElements;
}
