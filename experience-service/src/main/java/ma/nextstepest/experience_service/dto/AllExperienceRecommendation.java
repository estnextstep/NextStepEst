package ma.nextstepest.experience_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class AllExperienceRecommendation {


    private List<ExperienceDocument> content;
    private int totalPages;
    private long totalElements;

    public AllExperienceRecommendation(List<ExperienceDocument> content, long totalHits,int size) {
        this.content = content;
        this.totalElements = totalHits;
        this.totalPages = (int) Math.ceil((double) totalHits / size);
    }

}