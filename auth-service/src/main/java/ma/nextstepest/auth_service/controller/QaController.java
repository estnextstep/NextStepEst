package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.dto.Request.QuestionRequest;
import ma.nextstepest.auth_service.dto.Response.QuestionDto;
import ma.nextstepest.auth_service.dto.Response.QuestionInfoDto;
import ma.nextstepest.auth_service.exception.UserNotAllowed;
import ma.nextstepest.auth_service.service.QuestionService;
import ma.nextstepest.auth_service.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

@RestController
public class QaController {

    private final QuestionService questionService;
    private final RecommendationService recommendationService;
    public QaController(QuestionService questionService, RecommendationService recommendationService) {
        this.questionService = questionService;
        this.recommendationService = recommendationService;
    }

    @PostMapping("/question")
    public MessageResponse createQuestion(@RequestBody QuestionRequest questionRequest){
    MessageResponse message=new MessageResponse();
    boolean worked=questionService.createQuestion(questionRequest);
        if (!worked){
            throw new UserNotAllowed("couldn't add the question, please try again");
        }
        message.setMessage("your question added successfully");
        return message;
    }

    @DeleteMapping("/question/{id}")
    public MessageResponse deleteQuestion(@PathVariable Integer id){
        MessageResponse message = new MessageResponse();
        boolean works = questionService.deleteQuestion(id);
        if (!works){
            throw new UserNotAllowed("you are not allowed, you cant delete it");
        }
        message.setMessage("your question deleted successfully");
        return message;
    }
    @GetMapping("/question/all")
    public AllQuestionResponse getAllQuestions(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size){

        return questionService.getAllQuestions(page,size);
    }
    @GetMapping("/questionInfo")
    public QuestionInfoDto getQuestionInfo(@RequestParam Integer id, @RequestParam Integer page){
        return questionService.getQuestionInfo(id,page);
    }
    @GetMapping("/questions/recommendation")
    public AllQuestionResponse getRecommendedQuestions(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size){
        return recommendationService.getRecommendedQuestions(page,size);
    }
}
