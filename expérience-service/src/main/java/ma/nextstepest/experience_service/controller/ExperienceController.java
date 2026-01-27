package ma.nextstepest.experience_service.controller;

import ma.nextstepest.experience_service.dto.ExperienceRequest;
import ma.nextstepest.experience_service.entity.Experience;
import ma.nextstepest.experience_service.repository.ExperienceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/experience")
public class ExperienceController {
private final ExperienceRepository experienceRepository;

    public ExperienceController(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }
    @GetMapping("/{userId}")
    public ResponseEntity<ExperienceRequest> getexperience(@PathVariable Integer userId){
        Experience experience= experienceRepository.findByAlumniId(String.valueOf(userId));
        if(experience==null){
            return ResponseEntity.notFound().build();
        }
        ExperienceRequest exp=new ExperienceRequest();
        exp.setAlumniId(Integer.valueOf(experience.getAlumniId()));
        exp.setTitle(experience.getTitle());
        exp.setDescription(experience.getDescription());
        exp.setKeywords(experience.getKeywords());
        return ResponseEntity.ok(exp);
    }
}
