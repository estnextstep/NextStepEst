package ma.nextstepest.auth_service.dto;

import lombok.Data;

import java.util.ArrayList;

@Data
public class ExperienceRequest {

    private Integer alumniId;
    private String title;
    private String description;
    private String domain;
    private String keywords;
}
