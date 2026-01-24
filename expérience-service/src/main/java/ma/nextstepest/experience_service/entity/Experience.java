package ma.nextstepest.experience_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true,nullable = false)
    private Integer alumniId;

    private String title;
    private String description;
    private String domain;
    private ArrayList<String> keywords;

    private LocalDate created_at;

}
