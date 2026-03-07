package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.dto.recomandation.QuestionAnswer;
import ma.nextstepest.auth_service.service.RecomandService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class RecomandController {
    private final RecomandService recomandService;


    public RecomandController(RecomandService recomandService) {
        this.recomandService = recomandService;
    }

    @PostMapping("/orientation/test")
    public MessageResponse recomandation(@RequestBody List<QuestionAnswer> answers){
       return recomandService.recommend(answers);
    }
}
