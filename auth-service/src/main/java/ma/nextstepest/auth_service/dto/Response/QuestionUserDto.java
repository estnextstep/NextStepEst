package ma.nextstepest.auth_service.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionUserDto {
    private Integer id;
    private String title;
    private String keywords;
    private String content;
    private LocalDate created_at;
}

