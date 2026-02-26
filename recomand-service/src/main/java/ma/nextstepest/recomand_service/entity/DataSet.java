package ma.nextstepest.recomand_service.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "dataSet")
public class DataSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "author_id", nullable = false)
    private Integer authorId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String topMajor;

}
