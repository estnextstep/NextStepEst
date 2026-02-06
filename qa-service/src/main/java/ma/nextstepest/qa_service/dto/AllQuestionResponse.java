package ma.nextstepest.qa_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllQuestionResponse {

    private List<QuestionDto> content;
    private int totalPages;
    private long totalElements;


}
