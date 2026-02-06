package ma.nextstepest.auth_service.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto{
    private Integer id;
    private String title;
    private String keywords;
    private String content;
    private LocalDateTime created_at;
}

