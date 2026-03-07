package ma.nextstepest.auth_service.service;


import ma.nextstepest.auth_service.dto.recomandation.FiliereDTO;
import ma.nextstepest.auth_service.dto.recomandation.QuestionAnswer;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Service
public class RecomandClient {
    private final WebClient webClient;
    private final UserRepository userRepository;

    public RecomandClient(@Qualifier("recWebClient") WebClient webClient, UserRepository userRepository) {
        this.webClient = webClient;
        this.userRepository = userRepository;
    }

    public List<FiliereDTO> recommend(List<QuestionAnswer> answers,int userId) {
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/recommand")
                        .queryParam("authorId", userId)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(answers)
                .retrieve()
                .bodyToFlux(FiliereDTO.class)
                .collectList()
                .block();
    }
}
