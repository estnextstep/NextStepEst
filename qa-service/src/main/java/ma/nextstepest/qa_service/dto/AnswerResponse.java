package ma.nextstepest.qa_service.dto;

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

    public AnswerResponse(Integer id, String content, Integer authorId, Integer questionId) {
        this.id = id;
        this.content = content;
        this.authorId = authorId;
        this.questionId = questionId;
    }
}
