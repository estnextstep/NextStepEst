package ma.nextstepest.qa_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.nextstepest.qa_service.entity.Question;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllUserQuestionResponse {

    private List<Question> content;
    private int totalPages;
    private long totalElements;

}
