package ma.nextstepest.qa_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "answers")
public class Answer {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @Column(nullable = false, columnDefinition = "TEXT")
        private String content;

        @Column(name = "author_id", nullable = false)
        private Integer authorId;

        @Column(name = "question_id", nullable = false)
        private Integer questionId;

        @Column(name = "created_at")
        private LocalDateTime createdAt;
}
