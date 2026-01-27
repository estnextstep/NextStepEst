package ma.nextstepest.experience_service.controller;

import ma.nextstepest.experience_service.dto.ExperienceRequest;
import ma.nextstepest.experience_service.entity.Experience;
import ma.nextstepest.experience_service.repository.ExperienceRepository;
import ma.nextstepest.experience_service.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/getexperience")
public class ExperienceController {


    private final ExperienceRepository experienceRepository;
    private  final ExperienceService experienceService;
    public ExperienceController(ExperienceRepository experienceRepository, ExperienceService experienceService) {
        this.experienceRepository = experienceRepository;
        this.experienceService = experienceService;
    }
    @GetMapping("/{userId}")
    public ResponseEntity<ExperienceRequest> get_experience(@PathVariable Integer userId){
        return experienceService.getUserExperience(userId);

    }
}
