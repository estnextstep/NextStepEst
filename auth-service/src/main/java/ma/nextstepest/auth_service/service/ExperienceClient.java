package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.AllExperiencesResponse;
import ma.nextstepest.auth_service.dto.ExperienceRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ExperienceClient {
    private final WebClient webClient;

    public ExperienceClient(WebClient webClientBuilder) {
        this.webClient = webClientBuilder;
    }

    public ExperienceRequest getExperience(Integer userId){

        return webClient.get()
                .uri("getexperience/{id}",userId)
                .retrieve()
                .bodyToMono(ExperienceRequest.class).block();
    }
    public Mono<AllExperiencesResponse> getAll(int page, int size){
        return webClient.get()
                .uri("experiences?page={p}&size={s}",page,size)
                .retrieve()
                .bodyToMono(AllExperiencesResponse.class);
    }
}
