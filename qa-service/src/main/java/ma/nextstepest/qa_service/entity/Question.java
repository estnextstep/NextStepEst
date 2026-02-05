package ma.nextstepest.qa_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer authorId;

    private String title;
    private String content;
    private String keywords;
    private LocalDateTime created_at;


}
