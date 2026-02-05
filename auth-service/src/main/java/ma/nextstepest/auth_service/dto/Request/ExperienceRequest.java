package ma.nextstepest.auth_service.dto.Request;

import lombok.Data;

@Data
public class ExperienceRequest {

    private Integer alumniId;
    private String title;
    private String description;
    private String domain;
    private String keywords;
}
