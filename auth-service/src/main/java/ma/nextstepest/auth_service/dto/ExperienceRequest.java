package ma.nextstepest.auth_service.dto;

import lombok.Data;

import java.util.ArrayList;

@Data
public class ExperienceRequest {
    private String title;
    private String description;
    private String domain;
    private ArrayList<String> keywords;
}
