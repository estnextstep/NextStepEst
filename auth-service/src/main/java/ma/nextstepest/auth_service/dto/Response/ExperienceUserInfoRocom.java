package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

import java.util.List;

@Data
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


    public ExperienceUserInfoRocom(String title, String description, String domain, String firstname, String lastname, String username) {
    }
}
