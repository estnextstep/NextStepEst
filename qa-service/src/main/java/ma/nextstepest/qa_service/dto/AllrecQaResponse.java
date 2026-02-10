package ma.nextstepest.qa_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllrecQaResponse {
    

        private List<QuestionDocument> content;
        private int totalPages;
        private long totalElements;


    public AllrecQaResponse(List<QuestionDocument> questions, long totalHits,int size) {
        this.content = questions;
        this.totalElements = totalHits;
        this.totalPages = (int) Math.ceil((double) totalHits / size);
    }
}
