package ma.nextstepest.recomand_service.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.nextstepest.recomand_service.dto.*;
import ma.nextstepest.recomand_service.repository.DataSetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecomandService {

    private final DataSetService dataSetService;

    private final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RecomandService(DataSetService dataSetService) {
        this.dataSetService = dataSetService;
    }


    public List<FiliereDTO> getTop4Filiere(List<QuestionAnswer> answers,int author) throws Exception {

        String studentAnswers = answers.stream()
                .map(qa -> qa.getQuestion() + ": " + qa.getAnswer())
                .collect(Collectors.joining("\n"));

        String prompt = """
                You are an expert career recommendation system.
                Return ONLY valid JSON.
                No markdown.
                No explanations.
                JSON must follow exactly this structure:

                {
                  "top_filiere": [
                    {
                      "name": "string",
                      "reason": "string"
                    }
                  ]
                }

                Student answers:
                %s
                """.formatted(studentAnswers);

        Map<String, Object> request = new HashMap<>();
        request.put("model", "phi");
        request.put("prompt", prompt);
        request.put("stream", false);
        request.put("format", "json");

        ResponseEntity<String> response =
                restTemplate.postForEntity(OLLAMA_URL, request, String.class);

        // Parse outer JSON
        Map<?, ?> outer = objectMapper.readValue(response.getBody(), Map.class);

        // Extract inner JSON directly
        String innerJson = outer.get("response").toString();

        // Convert directly to DTO
        TopFiliereResponse result =
                objectMapper.readValue(innerJson, TopFiliereResponse.class);

        dataSetService.appendAnswerAsync(author,answers,result.getTop_filiere().getFirst().getName());

        // Return only top 4
        return result.getTop_filiere()
                .stream()
                .limit(4)
                .toList();
    }
}