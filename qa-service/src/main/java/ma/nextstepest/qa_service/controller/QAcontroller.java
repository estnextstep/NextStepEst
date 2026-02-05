package ma.nextstepest.qa_service.controller;

import ma.nextstepest.qa_service.dto.AllQuestionResponse;
import ma.nextstepest.qa_service.entity.Question;
import ma.nextstepest.qa_service.service.AnswerService;
import ma.nextstepest.qa_service.service.QuestionService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class QAcontroller {

    private final AnswerService answerService;
    private final QuestionService questionService;


    public QAcontroller(AnswerService answerService, QuestionService questionService) {
        this.answerService = answerService;
        this.questionService = questionService;
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
        return new AllQuestionResponse(
                questions.getContent(),
                questions.getTotalPages(),
                questions.getTotalElements()
        );
    }
}
