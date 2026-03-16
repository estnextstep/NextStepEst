package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {
    private final QAclient qAclient;
    private final UserRepository userRepository;

    public RecommendationService(QAclient qAclient, UserRepository userRepository) {
        this.qAclient = qAclient;
        this.userRepository = userRepository;
    }
    public AllQuestionResponse getRecommendedQuestions(int page,int size){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByEmail(email);
        String major=user.getMajor();
        return qAclient.getRecommendedQuestion(page,size,major);
    }
    public AllQuestionResponse searchQuestion(String query,int page ,int size){
        return qAclient.searchQuestion(page,size,query);
    }
}
