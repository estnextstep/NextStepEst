package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Request.QuestionRequest;
import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.QuestionInfoDto;

import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {
    private final UserRepository userRepository;
    private final MessageProducer messageProducer;
    private final QAclient qAclient;

    public QuestionService(UserRepository userRepository, MessageProducer messageProducer, QAclient qAclient) {
        this.userRepository = userRepository;
        this.messageProducer = messageProducer;
        this.qAclient = qAclient;
    }
    public boolean createQuestion(QuestionRequest questionRequest){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByEmail(email);

        if (user == null) return false;
        questionRequest.setAuthorId(user.getId());
        messageProducer.createQuestion(questionRequest);
        return true;

    }

    public AllQuestionResponse getAllQuestions(int page,int size){

        return qAclient.getAllQuestions(page,size);

    }

    public QuestionInfoDto getQuestionInfo(int id, int page){
        return qAclient.getQuestionInfo(id,page);
    }
}
