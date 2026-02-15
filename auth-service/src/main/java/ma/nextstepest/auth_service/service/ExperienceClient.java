package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Errorsdto;
import ma.nextstepest.auth_service.dto.Response.AllExperiencesResponse;
import ma.nextstepest.auth_service.dto.Request.ExperienceRequest;
import ma.nextstepest.auth_service.dto.Response.AllExperiencesRocom;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Objects;


@Service
public class ExperienceClient {
    private final WebClient webClient;
    private final UserRepository userRepository;
    public ExperienceClient(WebClient webClient, UserRepository userRepository) {
        this.webClient = webClient;
        this.userRepository = userRepository;
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

    public ResponseEntity<?> deleteExperience(Integer user_id){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User db_user = userRepository.findByEmail(email);

        if (db_user.isExpr() && db_user.getRole().equals("ALUMNI") && Objects.equals(db_user.getId(), user_id)){

        try {
            ResponseEntity<Void> response=webClient.delete()
                    .uri("getexperience/delete/{user_id}", user_id)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
            db_user.setExpr(false);
            userRepository.save(db_user);

            return ResponseEntity.ok(
                    new Errorsdto(true, "Experience deleted successfully"));

        }
        catch(WebClientResponseException e){
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        }
    }else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new Errorsdto(false,"Not allowed"));}
    }


    public MessageResponse deleteUserInfo(int id){
        return webClient.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/deleteUserExp")
                        .queryParam("id", id)
                        .build()
                )
                .retrieve()
                .bodyToMono(MessageResponse.class)
                .block();
    }

}
