package ma.nextstepest.auth_service.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto{
    private Integer author_id;
    private String name;
    private String lastName;
    private String username;
    private String profileUrl;
    private Integer id;
    private String title;
    private List<String> keywords;
    private String content;
    private LocalDate created_at;
}

