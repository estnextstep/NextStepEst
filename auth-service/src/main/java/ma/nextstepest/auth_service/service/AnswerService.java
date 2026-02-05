package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Request.AnswerRequest;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AnswerService {
    private final UserRepository userRepository;
    private final MessageProducer messageProducer;

    public AnswerService(UserRepository userRepository, MessageProducer messageProducer) {
        this.userRepository = userRepository;
        this.messageProducer = messageProducer;
    }

    public boolean createAnswer(AnswerRequest answerRequest, Integer Qid){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByEmail(email);
        if (user == null) return false;
        answerRequest.setAuthorId(user.getId());
        answerRequest.setQuestionId(Qid);
        messageProducer.createAnswer(answerRequest);
        return true;
    }

}
