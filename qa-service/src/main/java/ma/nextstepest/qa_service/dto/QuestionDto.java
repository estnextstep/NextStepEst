package ma.nextstepest.qa_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto{
    private Integer author_id;
    private Integer id;
    private String title;
    private String content;
    private List<String> keywords;
    private LocalDate created_at;
}

