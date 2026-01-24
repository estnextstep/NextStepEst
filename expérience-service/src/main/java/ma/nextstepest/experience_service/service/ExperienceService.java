package ma.nextstepest.experience_service.service;

import ma.nextstepest.experience_service.dto.ExperienceRequest;
import ma.nextstepest.experience_service.entity.Experience;
import ma.nextstepest.experience_service.repository.ExperienceRepository;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.Optional;
import java.util.TreeSet;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository){
        this.experienceRepository = experienceRepository;
    }

    @RabbitListener(queues = "add.queue")
    public void addExperience(String message){
        ExperienceRequest experienceRequest = new ObjectMapper().readValue(message, ExperienceRequest.class);
        Experience db_experience = new Experience();
        db_experience.setAlumniId(String.valueOf(experienceRequest.getAlumniId()));
        db_experience.setCreated_at(java.time.LocalDateTime.now());
        db_experience.setDescription(experienceRequest.getDescription());
        db_experience.setDomain(experienceRequest.getDomain());
        db_experience.setTitle(experienceRequest.getTitle());
        db_experience.setKeywords(experienceRequest.getKeywords());
        experienceRepository.save(db_experience);
    }
    @RabbitListener(queues = "dellete.queue")
    public void deleteExperience(String message){
        Experience experience =experienceRepository.findByAlumniId(message);
        experienceRepository.delete(experience);
    }

    @RabbitListener(queues = "update.queue")
    public void updateExperience(String message){
        ExperienceRequest emailDtoAuth = new ObjectMapper().readValue(message, ExperienceRequest.class);

    }

    public Experience getUserExperience(){
        return null;
    }

    public TreeSet<Experience> getAllExperience(){
        return new TreeSet<Experience>();
    }
}
