package ma.nextstepest.qa_service.controller;

import ma.nextstepest.qa_service.dto.AllQuestionResponse;
import ma.nextstepest.qa_service.dto.AllrecQaResponse;
import ma.nextstepest.qa_service.dto.QuestionDto;
import ma.nextstepest.qa_service.dto.QuestionInfoDto;
import ma.nextstepest.qa_service.entity.Question;
import ma.nextstepest.qa_service.service.AnswerService;
import ma.nextstepest.qa_service.service.QuestionService;
import ma.nextstepest.qa_service.service.RecommendationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
public class QAcontroller {

    private final AnswerService answerService;
    private final QuestionService questionService;
    private final RecommendationService recommendationService;

    public QAcontroller(AnswerService answerService, QuestionService questionService, RecommendationService recommendationService) {
        this.answerService = answerService;
        this.questionService = questionService;
        this.recommendationService = recommendationService;
    }

    @DeleteMapping("/answer/{answerId}")
    public ResponseEntity deleteAnswer(@PathVariable Integer answerId,
                                       @RequestHeader("X-USER-ID") Integer userId) throws Exception {
        answerService.deleteAnswer(answerId,userId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/question/all")
    public AllQuestionResponse getAllQuestions(@RequestParam int page,
                                               @RequestParam int size){
        Page<Question> questions=questionService.getAllQuestions(page,size);

        List<QuestionDto> content = questions.getContent()
                .stream()
                .map(q -> new QuestionDto(
                        q.getId(),
                        q.getTitle(),
                        q.getContent(),
                        Collections.singletonList(q.getKeywords()),
                        q.getCreated_at()
                ))
                .toList();
        return new AllQuestionResponse(
                content,
                questions.getTotalPages(),
                questions.getTotalElements()
        );
    }

    @GetMapping("/detailsQuestion")
    public QuestionInfoDto getQuestionInfo(@RequestParam int id, @RequestParam int page){

        return questionService.getQuestionInfo(id,page);
    }
    @GetMapping("/questions/recommendation")
    public AllrecQaResponse getRecommendedQuestion(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   @RequestParam String major)
    {
    return recommendationService.getRecommendedQuestions(page,size,major);
    }
}
