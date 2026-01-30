package ma.nextstepest.qa_service.service;

import ma.nextstepest.qa_service.dto.QuestionRequest;
import ma.nextstepest.qa_service.entity.Question;
import ma.nextstepest.qa_service.repository.QuestionRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @RabbitListener(queues = "create.queue")
    public void createQuestion(String message){
        QuestionRequest questionRequest=new ObjectMapper().readValue(message, QuestionRequest.class);
        Question db_question=new Question();
        db_question.setContent(questionRequest.getContent());
        db_question.setAuthorId(questionRequest.getAuthorId());
        db_question.setCreated_at(java.time.LocalDateTime.now());
        questionRepository.save(db_question);
    }

    @RabbitListener(queues = "deleteQa.queue")
    public void deleteQuestion(Integer id){


        questionRepository.deleteById(id);
    }
}
