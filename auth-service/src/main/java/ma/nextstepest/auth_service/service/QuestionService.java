package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.QuestionRequest;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {
    private final UserRepository userRepository;
    private final MessageProducer messageProducer;

    public QuestionService(UserRepository userRepository, MessageProducer messageProducer) {
        this.userRepository = userRepository;
        this.messageProducer = messageProducer;
    }
    public boolean createQuestion(QuestionRequest questionRequest){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByEmail(email);

        if (user == null) return false;
        questionRequest.setAuthorId(user.getId());
        messageProducer.createQuestion(questionRequest);
        return true;

    }
    public boolean deleteQuestion(Integer id){

        messageProducer.deleteQuestion(id);
        return true;
    }
}
