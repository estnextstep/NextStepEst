package ma.nextstepest.qa_service.service;

import ma.nextstepest.qa_service.Exceptions.QANotFoundException;
import ma.nextstepest.qa_service.Exceptions.UserNotAllowed;
import ma.nextstepest.qa_service.dto.*;
import ma.nextstepest.qa_service.entity.Answer;
import ma.nextstepest.qa_service.entity.Question;
import ma.nextstepest.qa_service.repository.AnswerRepository;
import ma.nextstepest.qa_service.repository.QuestionRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    @Autowired
    private ElasticsearchOperations elasticsearchOperations;
    public QuestionService(QuestionRepository questionRepository, AnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    @RabbitListener(queues = "createQst.queue")
    public void createQuestion(String message){
        QuestionRequest questionRequest=new ObjectMapper().readValue(message, QuestionRequest.class);
        Question db_question=new Question();
        db_question.setTitle(questionRequest.getTitle());
        db_question.setContent(questionRequest.getContent());
        db_question.setKeywords(questionRequest.getKeywords());
        db_question.setAuthorId(questionRequest.getAuthorId());
        db_question.setCreated_at(LocalDate.now());
        Question savedQst= questionRepository.save(db_question);

        //elasticsearch
        QuestionDocument questionDocument=new QuestionDocument();
        questionDocument.setId(savedQst.getId());
        questionDocument.setTitle(savedQst.getTitle());
        questionDocument.setContent(savedQst.getContent());
        questionDocument.setKeywords(
                Arrays.stream(savedQst.getKeywords().split(","))
                        .map(String::trim)
                        .collect(Collectors.toList())
        );
        questionDocument.setCreated_at(savedQst.getCreated_at());
        try {
            elasticsearchOperations.save(questionDocument);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }


    public void deleteQuestion(Integer id, Integer user_id) {

        Question question = questionRepository.findById(id).orElseThrow(()->
                new QANotFoundException("there is an error while trying to remove this question"));

        if(!question.getAuthorId().equals(user_id)){
            throw new UserNotAllowed("user not allowed to remove the question");
        }
        questionRepository.delete(question);

    }

    public Page<Question> getAllQuestions(int page, int size){
        return questionRepository.findAll(PageRequest.of(page, size));
    }

    public QuestionInfoDto getQuestionInfo(int id, int page){
        Optional<Question> change_question = questionRepository.findById(id);
        Question question = change_question.get();
        QuestionInfoDto questionInfoDto = new QuestionInfoDto();
        questionInfoDto.setQuestion(QuestionDto.builder()
                .id(question.getId())
                .title(question.getTitle())
                .created_at(question.getCreated_at())
                .keywords(Collections.singletonList(question.getKeywords()))
                .content(question.getContent()).build());

        Page<Answer> answers= answerRepository.findAllByQuestionId(id,PageRequest.of(page,6));
        List<AnswerResponse> content = answers.getContent()
                .stream()
                .map(q -> new AnswerResponse(
                        q.getId(),
                        q.getContent(),
                        q.getAuthorId(),
                        q.getQuestionId()
                ))
                .toList();
        questionInfoDto.setAnswers(content);
        questionInfoDto.setTotalPages(answers.getTotalPages());
        questionInfoDto.setTotalElements(answers.getTotalElements());
        return questionInfoDto;
    }

}