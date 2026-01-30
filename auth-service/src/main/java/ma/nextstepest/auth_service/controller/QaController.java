package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.MessageResponse;
import ma.nextstepest.auth_service.dto.QuestionRequest;
import ma.nextstepest.auth_service.exception.UserNotAllowed;
import ma.nextstepest.auth_service.service.QuestionService;
import org.springframework.web.bind.annotation.*;

@RestController
public class QaController {

    private final QuestionService questionService;

    public QaController(QuestionService questionService) {
        this.questionService = questionService;
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
}
