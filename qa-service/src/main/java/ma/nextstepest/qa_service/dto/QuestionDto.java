package ma.nextstepest.qa_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto{
    private Integer id;
    private String title;
    private String content;
    private String keywords;
    private LocalDateTime created_at;
}

