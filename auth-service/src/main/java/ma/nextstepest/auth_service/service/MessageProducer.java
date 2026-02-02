package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.DeleteQuestionRequest;
import ma.nextstepest.auth_service.dto.EmailDtoAuth;
import ma.nextstepest.auth_service.dto.ExperienceRequest;
import ma.nextstepest.auth_service.dto.QuestionRequest;
import ma.nextstepest.auth_service.exception.UserNotAllowed;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class MessageProducer {

    private final RabbitTemplate rabbitTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    public MessageProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendEmail(EmailDtoAuth email_dto) {
        String json = objectMapper.writeValueAsString(email_dto);
        rabbitTemplate.convertAndSend(
                "email.exchange",
                "email.user.created",
                json
        );
    }

    public void addExperience(ExperienceRequest experienceRequest){
        String json= objectMapper.writeValueAsString(experienceRequest);
        rabbitTemplate.convertAndSend(
                "experience.exchange",
                "experience.ajouter",
                json
        );
    }

    public void deleteExperience(String alumniId){
        rabbitTemplate.convertAndSend(
                "experience.exchange",
                "experience.delete",
                alumniId
        );
    }

    public void updateExperience(ExperienceRequest experienceRequest){
        String json= objectMapper.writeValueAsString(experienceRequest);
        rabbitTemplate.convertAndSend(
                "experience.exchange",
                "experience.update",
                json
        );
    }

    public void createQuestion(QuestionRequest questionRequest){
        String json= objectMapper.writeValueAsString(questionRequest);
        rabbitTemplate.convertAndSend(
                "qa.exchange",
                "create.question",
                json
        );
    }

    public void deleteQuestion(DeleteQuestionRequest deleteQuestionRequest){
        String json= objectMapper.writeValueAsString(deleteQuestionRequest);
        rabbitTemplate.convertAndSend(
                "qa.exchange",
                "delete.question",
                json
        );
    }

}