package ma.nextstepest.auth_service.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceUserInfoRocom {
    private String title;
    private String description;
    private String domain;
    private List<String> keywords;


    // user info
    private Integer alumniId;
    private String imgUrl;
    private String firstName;
    private String lastName;
    private String username;



}
