package ma.nextstepest.recomand_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import ma.nextstepest.recomand_service.dto.QuestionAnswer;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecomandService {

    private final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode getTopFiliere(List<QuestionAnswer> answers) throws Exception {


        String studentAnswers = answers.stream()
                .map(qa -> qa.getQuestion() + ": " + qa.getAnswer())
                .collect(Collectors.joining("\n"));


        String prompt = """
                You are an expert career recommendation system.

                INPUT:
                - Student answers to a questionnaire (questions and answers).

                TASK:
                - Analyze the student answers.
                - Return ONLY a valid JSON object.
                - The JSON must contain exactly 10 recommended majors.
                - No text, no markdown, no explanations, no comments.
                - JSON must be valid and parsable.
                - No newlines or escape characters inside string values.
                REQUIRED JSON STRUCTURE:

                {
                  "top_filiere": [
                    {
                      "name": "string",
                    }
                  ]
                }

                Student answers:
                %s
                """.formatted(studentAnswers);


        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "phi");
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);


        ResponseEntity<String> response = restTemplate.postForEntity(OLLAMA_URL, requestBody, String.class);


        String rawResponse = response.getBody().trim()
                .replaceAll("^`+", "") // remove starting backticks
                .replaceAll("`+$", "") // remove ending backticks
                .replaceAll("\\\\n", "") // remove escaped newlines
                .replaceAll("\\\\", ""); // remove stray backslashes


        JsonNode root = objectMapper.readTree(rawResponse);


        String innerJson = root.get("response").asText().trim()
                .replaceAll("^`+", "")
                .replaceAll("`+$", "")
                .replaceAll("\\\\n", "")
                .replaceAll("\\\\", "");


        JsonNode finalResult = objectMapper.readTree(innerJson);


        JsonNode topFiliereArray = finalResult.get("top_filiere");


        List<JsonNode> top4 = new ArrayList<>();
        for (int i = 0; i < Math.min(4, topFiliereArray.size()); i++) {
            top4.add(topFiliereArray.get(i));
        }

        ArrayNode top4ArrayNode = objectMapper.createArrayNode();
        top4ArrayNode.addAll(top4);

        return top4ArrayNode;
    }
}