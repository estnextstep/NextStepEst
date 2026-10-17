package ma.nextstepest.experience_service.dto;

import jakarta.persistence.Column;
import lombok.Data;



@Data
public class ExperienceRequest {
    private Integer alumniId;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String domain;
    private String keywords;
}
