package ma.nextstepest.experience_service.service;

import ma.nextstepest.experience_service.Excpetions.ExperienceNotfoundException;
import ma.nextstepest.experience_service.dto.AllExperienceRecommendation;
import ma.nextstepest.experience_service.dto.ExperienceDocument;
import ma.nextstepest.experience_service.dto.ExperienceRequest;
import ma.nextstepest.experience_service.dto.MessageResponse;
import ma.nextstepest.experience_service.entity.Experience;
import ma.nextstepest.experience_service.repository.ExperienceRepository;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class ExperienceService {

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;
    private final ExperienceRepository experienceRepository;
    private final RecommendationService recommendationService;

    public ExperienceService(ExperienceRepository experienceRepository, RecommendationService recommendationService){
        this.experienceRepository = experienceRepository;
        this.recommendationService = recommendationService;
    }

    @RabbitListener(queues = "add.queue")
    public void addExperience(String message){
        ExperienceRequest experienceRequest = new ObjectMapper().readValue(message, ExperienceRequest.class);
        Experience db_experience = new Experience();
        db_experience.setAlumniId(experienceRequest.getAlumniId());
        db_experience.setCreated_at(java.time.LocalDateTime.now());
        db_experience.setDescription(experienceRequest.getDescription());
        db_experience.setDomain(experienceRequest.getDomain());
        db_experience.setTitle(experienceRequest.getTitle());
        db_experience.setKeywords(experienceRequest.getKeywords());
        Experience savedExp = experienceRepository.save(db_experience);

        //elasticsearch
        ExperienceDocument experienceDocument = new ExperienceDocument();
        experienceDocument.setId(String.valueOf(savedExp.getId()));
        experienceDocument.setDomain(savedExp.getDomain());
        experienceDocument.setKeywords(
                Arrays.stream(savedExp.getKeywords().split(","))
                        .map(String::trim)
                        .collect(Collectors.toList())
        );
        experienceDocument.setAlumniId(savedExp.getAlumniId());
        experienceDocument.setDescription(savedExp.getDescription());
        experienceDocument.setTitle(savedExp.getTitle());
        experienceDocument.setCreated_at(savedExp.getCreated_at().toLocalDate());
        try {
            elasticsearchOperations.save(experienceDocument);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteExperience(Integer user_Id){
        Experience experience =experienceRepository.findByAlumniId(String.valueOf(user_Id));
        if(experience==null){
            throw new ExperienceNotfoundException("error while removing experience");
        }
        try {
            elasticsearchOperations.delete(String.valueOf(experience.getId()), ExperienceDocument.class);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        experienceRepository.delete(experience);
    }

    @RabbitListener(queues = "updaate.queue")
    public void updateExperience(String message){
            ExperienceRequest experienceRequest=new ObjectMapper().readValue(message, ExperienceRequest.class);
            Experience experience=experienceRepository.findByAlumniId(String.valueOf(experienceRequest.getAlumniId()));
            experience.setTitle(experienceRequest.getTitle());
            experience.setDescription(experienceRequest.getDescription());
            experience.setKeywords(experienceRequest.getKeywords());
            experienceRepository.save(experience);

        ExperienceDocument experienceDocument = new ExperienceDocument();
        experienceDocument.setId(String.valueOf(experience.getId()));
        experienceDocument.setDomain(experience.getDomain());
        experienceDocument.setKeywords(
                Arrays.stream(experience.getKeywords().split(","))
                        .map(String::trim)
                        .collect(Collectors.toList())
        );
        experienceDocument.setAlumniId(experience.getAlumniId());
        experienceDocument.setDescription(experience.getDescription());
        experienceDocument.setTitle(experience.getTitle());
        experienceDocument.setCreated_at(experience.getCreated_at().toLocalDate());
        try {
            elasticsearchOperations.save(experienceDocument);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<ExperienceRequest> getUserExperience(Integer userId){
        Experience experience= experienceRepository.findByAlumniId(String.valueOf(userId));
        if(experience==null){
            return ResponseEntity.notFound().build();
        }
        ExperienceRequest exp=new ExperienceRequest();
        exp.setAlumniId(experience.getAlumniId());
        exp.setTitle(experience.getTitle());
        exp.setDescription(experience.getDescription());
        exp.setDomain(experience.getDomain());
        exp.setKeywords(experience.getKeywords());
        return ResponseEntity.ok(exp);
    }

    public Page<Experience> getAll(int page,int size){
        return experienceRepository.findAll(PageRequest.of(page,size));
    }

    public AllExperienceRecommendation getRecommendedExperience(int page, int size, String major){
        return recommendationService.getRecommendedExperience(page, size, major);
    }

    public MessageResponse deleteUserInfo(int id) {
        Experience experience =experienceRepository.findByAlumniId(String.valueOf(id));
        if(experience==null){
            throw new ExperienceNotfoundException("error while removing experience");
        }
        try {
            elasticsearchOperations.delete(String.valueOf(experience.getId()), ExperienceDocument.class);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        experienceRepository.delete(experience);
        return new MessageResponse();
    }
}
