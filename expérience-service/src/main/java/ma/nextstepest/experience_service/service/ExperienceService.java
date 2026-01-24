package ma.nextstepest.experience_service.service;

import ma.nextstepest.experience_service.entity.Experience;
import ma.nextstepest.experience_service.repository.ExperienceRepository;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.util.TreeSet;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository){
        this.experienceRepository = experienceRepository;
    }

    @RabbitListener(queues = "add.queue")
    public void addExperience(String message){

    }
    @RabbitListener(queues = "delete.queue")
    public void deleteExperience(){

    }

    @RabbitListener(queues = "update.queue")
    public void updateExperience(){

    }

    public Experience getUserExperience(){
        return null;
    }

    public TreeSet<Experience> getAllExperience(){
        return new TreeSet<Experience>();
    }
}
