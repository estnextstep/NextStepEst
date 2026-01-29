package ma.nextstepest.experience_service.controller;

import ma.nextstepest.experience_service.dto.AllExperiencesResponse;
import ma.nextstepest.experience_service.dto.ExperienceRequest;
import ma.nextstepest.experience_service.entity.Experience;
import ma.nextstepest.experience_service.repository.ExperienceRepository;
import ma.nextstepest.experience_service.service.ExperienceService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/getexperience")
public class ExperienceController {


    private  final ExperienceService experienceService;
    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }
    @GetMapping("/{userId}")
    public ResponseEntity<ExperienceRequest> get_experience(@PathVariable Integer userId){
        return experienceService.getUserExperience(userId);

    }
    @GetMapping("/exp")
    public AllExperiencesResponse getAll(@RequestParam int page,
                                         @RequestParam int size)
    {
        Page<Experience> p=experienceService.getAll(page,size);
        return new AllExperiencesResponse(
                p.getContent(),
                p.getTotalPages(),
                p.getTotalElements()

        );
    }
}
