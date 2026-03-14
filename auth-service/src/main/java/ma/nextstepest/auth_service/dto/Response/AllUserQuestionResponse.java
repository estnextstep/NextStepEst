package ma.nextstepest.auth_service.dto.Response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllUserQuestionResponse {

    private List<QuestionUserDto> content;
    private int totalPages;
    private long totalElements;

}
