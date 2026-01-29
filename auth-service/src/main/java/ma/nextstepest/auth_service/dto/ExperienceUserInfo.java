package ma.nextstepest.auth_service.dto;

import lombok.Data;

import java.util.List;
@Data
public class ExperienceUserInfo {
    private String title;
    private String description;
    private String domain;
    private String keywords;

    // user info
    private Integer alumniId;
    private String imgUrl;
    private String firstName;
    private String lastName;
    private String username;


    public ExperienceUserInfo(String title, String description, String domain, String firstname, String lastname, String username) {
    }
}
