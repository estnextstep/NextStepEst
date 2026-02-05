package ma.nextstepest.qa_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.nextstepest.qa_service.entity.Question;

import java.util.List;

@Data
public class AllQuestionResponse {

    private List<Question> content;
    private int totalPages;
    private long totalElements;


    public AllQuestionResponse(List<Question> content, int totalPages, long totalElements) {
    }
}
