package ma.nextstepest.auth_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class AllExperiencesResponse {


    private List<ExperienceUserInfo> content;
    private int totalPages;
    private long totalElements;

    public AllExperiencesResponse(List<ExperienceUserInfo> list, int totalPages, long totalElements) {
        this.content = list;
        this.totalPages=totalPages;
        this.totalElements = totalElements;
    }

    public AllExperiencesResponse(){

    }


    // constructor + getters
}

