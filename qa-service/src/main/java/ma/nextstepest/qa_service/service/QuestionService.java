package ma.nextstepest.qa_service.service;

import ma.nextstepest.qa_service.dto.AllQuestionResponse;
import ma.nextstepest.qa_service.dto.DeleteQuestionRequest;
import ma.nextstepest.qa_service.dto.QuestionDto;
import ma.nextstepest.qa_service.dto.QuestionRequest;
import ma.nextstepest.qa_service.entity.Question;
import ma.nextstepest.qa_service.repository.QuestionRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @RabbitListener(queues = "createQst.queue")
    public void createQuestion(String message){
        QuestionRequest questionRequest=new ObjectMapper().readValue(message, QuestionRequest.class);
        Question db_question=new Question();
        db_question.setTitle(questionRequest.getTitle());
        db_question.setContent(questionRequest.getContent());
        db_question.setKeywords(questionRequest.getKeywords());
        db_question.setAuthorId(questionRequest.getAuthorId());
        db_question.setCreated_at(java.time.LocalDateTime.now());
        questionRepository.save(db_question);
    }

    @RabbitListener(queues = "deleteQst.queue")
    public void deleteQuestion(String message) {
        DeleteQuestionRequest req=new ObjectMapper().readValue(message, DeleteQuestionRequest.class);
        Optional<Question> question = questionRepository.findById(req.getQuestionId());

        Question question_db = question.get();
        questionRepository.delete(question_db);

    }

    public Page<Question> getAllQuestions(int page, int size){

    return   questionRepository.findAll(PageRequest.of(page, size));

    }
}