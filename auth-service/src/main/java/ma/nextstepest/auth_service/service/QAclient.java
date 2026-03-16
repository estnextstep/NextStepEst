package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.AllUserQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.dto.Response.QuestionInfoDto;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class QAclient {
    private final WebClient webClient;
    private final UserRepository userRepository;

    public QAclient(

        @Qualifier("qaWebClient") WebClient webClient, UserRepository userRepository) {
        this.webClient = webClient;
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> deleteAnswer(Integer answerId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");

        Integer userId = user.getId();
        try{
           return webClient.delete()
                    .uri("/answer/{answerId}", answerId)
                    .header("X-USER-ID", userId.toString())
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }
        catch (WebClientResponseException ex){
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(ex.getResponseBodyAsString());
        }
    }

    public AllQuestionResponse getAllQuestions(int page,int size){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/question/all")
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .build()
                )
                .retrieve()
                .bodyToMono(AllQuestionResponse.class)
                .block();

    }

    public QuestionInfoDto getQuestionInfo(int id_q, int page){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/detailsQuestion")
                        .queryParam("id", id_q)
                        .queryParam("page", page)
                        .build()
                )
                .retrieve()
                .bodyToMono(QuestionInfoDto.class)
                .block();
    }
    public AllQuestionResponse getRecommendedQuestion(int page,int size,String major){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/questions/recommendation")
                        .queryParam("major", major)
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .build()
                )
                .retrieve()
                .bodyToMono(AllQuestionResponse.class)
                .block();
    }
    public ResponseEntity<?> deleteQuestion(Integer id){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email);
        if (user == null)
            throw new RuntimeException("User not found");

        Integer userId = user.getId();
        try{
            return webClient.delete()
                    .uri("/question/{id}", id)
                    .header("X-USER-ID", userId.toString())
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }catch (WebClientResponseException e){
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        }
    }
    public MessageResponse deleteUserInfo(int id){
        return webClient.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/deleteUserInfo")
                        .queryParam("id", id)
                        .build()
                )
                .retrieve()
                .bodyToMono(MessageResponse.class)
                .block();
    }
    public AllUserQuestionResponse getUserQuestions(int user_id,int page){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/user/questions")
                        .queryParam("user_id", user_id)
                        .queryParam("page",page)
                        .build()
                )
                .retrieve()
                .bodyToMono(AllUserQuestionResponse.class)
                .block();
    }
    public AllQuestionResponse searchQuestion(int page,int size,String query){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/questions/search")
                        .queryParam("query",query)
                        .queryParam("page",page)
                        .queryParam("size",size)
                        .build()
                )
                .retrieve()
                .bodyToMono(AllQuestionResponse.class)
                .block();
    }
}
