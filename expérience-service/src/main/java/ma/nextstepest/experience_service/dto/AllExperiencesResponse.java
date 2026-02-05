package ma.nextstepest.experience_service.dto;

import lombok.Data;
import ma.nextstepest.experience_service.entity.Experience;

import java.util.List;

@Data
public class AllExperiencesResponse {

    private List<Experience> content;
    private int totalPages;
    private long totalElements;

    public AllExperiencesResponse(List<Experience> content, int totalPages, long totalElements) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;

    }

}

