package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

import java.util.List;

@Data
public class AllExperiencesRocom {


    private List<ExperienceUserInfoRocom> content;
    private int totalPages;
    private long totalElements;

    public AllExperiencesRocom(List<ExperienceUserInfoRocom> list, int totalPages, long totalElements) {
        this.content = list;
        this.totalPages=totalPages;
        this.totalElements = totalElements;
    }

    public AllExperiencesRocom(){

    }


    // constructor + getters
}

