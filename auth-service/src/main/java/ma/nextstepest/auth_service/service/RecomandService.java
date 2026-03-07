package ma.nextstepest.auth_service.service;


import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.dto.recomandation.FiliereDTO;
import ma.nextstepest.auth_service.dto.recomandation.QuestionAnswer;
import ma.nextstepest.auth_service.dto.recomandation.TopFiliereResponse;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecomandService {
    private final RecomandClient recomandClient;
    private final MessageProducer producer;
    private final UserRepository userRepository;

    public RecomandService(RecomandClient recomandClient, MessageProducer producer, UserRepository userRepository) {
        this.recomandClient = recomandClient;
        this.producer = producer;
        this.userRepository = userRepository;
    }

    public MessageResponse recommend(List<QuestionAnswer> answers){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");

        Integer userId = user.getId();

        List<FiliereDTO> recommend_majors = recomandClient.recommend(answers,userId);
        TopFiliereResponse topFiliereResponse = new TopFiliereResponse();

        if (recommend_majors.isEmpty()){
            return new MessageResponse(false);
        }
        topFiliereResponse.setTop_filiere(recommend_majors);
        topFiliereResponse.setTo_mail(email);
        producer.sendEmailRecommend(topFiliereResponse);
        return new MessageResponse("check your email");
    }
}
