package ma.nextstepest.recomand_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import ma.nextstepest.recomand_service.dto.QuestionAnswer;
import ma.nextstepest.recomand_service.services.RecomandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommand")
public class RecomandController {

    private final RecomandService recomandService;

    public RecomandController(RecomandService recomandService) {
        this.recomandService = recomandService;
    }

    @PostMapping
    public ResponseEntity<?> recommend(@RequestBody List<QuestionAnswer> answers) {
        try {
            JsonNode topFiliere = recomandService.getTopFiliere(answers);
            return ResponseEntity.ok(topFiliere);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}