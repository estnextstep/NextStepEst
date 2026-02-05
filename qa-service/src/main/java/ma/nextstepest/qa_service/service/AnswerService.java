package ma.nextstepest.qa_service.service;

import ma.nextstepest.qa_service.Exceptions.QANotFoundException;
import ma.nextstepest.qa_service.dto.AnswerDto;
import ma.nextstepest.qa_service.entity.Answer;
import ma.nextstepest.qa_service.repository.AnswerRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final ObjectMapper objectMapper;
    public AnswerService(AnswerRepository answerRepository, ObjectMapper objectMapper) {
        this.answerRepository = answerRepository;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "createAns.queue")
    public void createAnswer(String message){
        AnswerDto answer=objectMapper.readValue(message, AnswerDto.class);
        Answer db_answer=new Answer();
        db_answer.setQuestionId(answer.getQuestionId());
        db_answer.setAuthorId(answer.getAuthorId());
        db_answer.setContent(answer.getContent());
        db_answer.setCreatedAt(java.time.LocalDateTime.now());
        answerRepository.save(db_answer);
    }

    public void deleteAnswer(Integer answerId, Integer userId) {


        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new QANotFoundException("Answer not found"));

        if (!answer.getAuthorId().equals(userId)) {
            throw new RuntimeException("Not allowed");
        }
        answerRepository.deleteById(answerId);
    }

}