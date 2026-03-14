package ma.nextstepest.experience_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;
import java.util.List;

@Document(indexName = "exp_index")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExperienceDocument {
    @Id
    private String id;

    private int alumniId;
    @Field(type = FieldType.Keyword)
    private List<String> keywords;
    @Field(type = FieldType.Text)
    private String title;
    @Field(type = FieldType.Text)
    private String description;
    @Field(type = FieldType.Text)
    private String domain;
    @Field(type = FieldType.Date)
    private LocalDate created_at;
}
