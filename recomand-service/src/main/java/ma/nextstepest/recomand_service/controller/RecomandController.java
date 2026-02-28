package ma.nextstepest.recomand_service.controller;

import ma.nextstepest.recomand_service.dto.*;
import ma.nextstepest.recomand_service.services.RecomandService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RecomandController {

    private final RecomandService recomandService;

    public RecomandController(RecomandService recomandService) {
        this.recomandService = recomandService;
    }

    @PostMapping("/recommand")
    public List<FiliereDTO> recommend(@RequestBody List<QuestionAnswer> answers,@RequestParam int authorId) throws Exception {
        return recomandService.getTop4Filiere(answers,authorId);
    }
}