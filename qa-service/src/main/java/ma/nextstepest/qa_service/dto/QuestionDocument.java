package ma.nextstepest.qa_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;
import java.util.List;

@Document(indexName = "qa_index")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuestionDocument {

    @Id
    private String id;
    @Field(type = FieldType.Keyword)
    private List<String> keywords;
    @Field(type = FieldType.Text)
    private String title;
    @Field(type = FieldType.Text)
    private String content;
    @Field(type = FieldType.Date)
    private LocalDate created_at;
}
