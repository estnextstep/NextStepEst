package ma.nextstepest.auth_service.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerResponse {


    private Integer id;

    private String content;

    private Integer authorId;

    private Integer questionId;
    // user info
    private Integer alumniId;
    private String imgUrl;
    private String firstName;
    private String lastName;
    private String username;
}
