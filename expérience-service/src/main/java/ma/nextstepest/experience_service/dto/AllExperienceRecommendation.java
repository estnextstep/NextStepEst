package ma.nextstepest.experience_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class AllExperienceRecommendation {


    private List<ExperienceDocument> content;
    private Long totalElements;
    private int totalPages;

    public AllExperienceRecommendation(List<ExperienceDocument> content, long totalPages, int totalElements) {
        this.content = content;
        this.totalPages = Math.toIntExact(totalPages);
        this.totalElements = (long) Math.ceil((double) totalPages / totalElements);
    }

}