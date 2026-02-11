package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Response.AllExperiencesResponse;
import ma.nextstepest.auth_service.dto.Request.ExperienceRequest;
import ma.nextstepest.auth_service.dto.Response.AllExperiencesRocom;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class ExperienceClient {
    private final WebClient webClient;

    public ExperienceClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public ExperienceRequest getExperience(Integer userId){

        return webClient.get()
                .uri("getexperience/{id}",userId)
                .retrieve()
                .bodyToMono(ExperienceRequest.class).block();
    }

    public AllExperiencesResponse getAll(int page, int size){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/getexperience/exp")
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .build()
                )
                .retrieve()
                .bodyToMono(AllExperiencesResponse.class)
                .block();
    }

    public AllExperiencesRocom getRecommendedExperience(int page, int size, String major){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("getexperience/exp/recommendation")
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .queryParam("major",major)
                        .build()
                )
                .retrieve()
                .bodyToMono(AllExperiencesRocom.class)
                .block();
    }
}
