package ma.nextstepest.qa_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
        name = "question_likes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"question_id", "user_id"})
        }
)
public class QuestionLike {

    // getters & setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "question_id", nullable = false)
    private Integer questionId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


}
