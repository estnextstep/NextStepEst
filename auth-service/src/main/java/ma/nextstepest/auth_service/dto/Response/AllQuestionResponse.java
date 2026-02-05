package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AllQuestionResponse {

    private Integer id;
    private String title;
    private String keywords;
    private LocalDateTime created_at;

}
