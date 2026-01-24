package ma.nextstepest.auth_service.dto;

import lombok.Data;
import ma.nextstepest.experience_service.entity.Experience;

import java.util.ArrayList;

@Data
public class ExperienceResponse {

    private ArrayList<Experience> experiences;
}
