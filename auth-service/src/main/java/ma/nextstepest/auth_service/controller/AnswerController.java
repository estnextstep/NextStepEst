package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.Request.AnswerRequest;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.exception.UserNotAllowed;
import ma.nextstepest.auth_service.service.AnswerService;
import ma.nextstepest.auth_service.service.QAclient;
import org.springframework.web.bind.annotation.*;

@RestController
public class AnswerController {

    private final AnswerService answerService;
    private final QAclient qAclient;

    public AnswerController(AnswerService answerService, QAclient qAclient) {

        this.answerService = answerService;
        this.qAclient = qAclient;
    }

    @PostMapping("/answer/{Qid}")
    public MessageResponse addAnswer(@RequestBody AnswerRequest answerRequest, @PathVariable Integer Qid){
        MessageResponse message=new MessageResponse();
        boolean worked=answerService.createAnswer(answerRequest,Qid);
        if (!worked){
            throw new UserNotAllowed("couldn't add your answer, please try again");
        }
        message.setMessage("your answer added successfully");
        return message;
    }
    @DeleteMapping("/answer/{answerId}")
    public MessageResponse deleteAnswer(@PathVariable Integer answerId){
        MessageResponse message=new MessageResponse();
        boolean worked=qAclient.deleteAnswer(answerId);
        if (!worked){
            throw new UserNotAllowed("couldn't delete your answer, please try again");
        }
        message.setMessage("your answer deleted successfully");
        return message;
    }
}
