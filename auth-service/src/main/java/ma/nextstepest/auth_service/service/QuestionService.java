package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Request.QuestionRequest;
import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.QuestionDto;
import ma.nextstepest.auth_service.dto.Response.QuestionInfoDto;

import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.exception.UserNotFoundException;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        AllQuestionResponse allQuestionResponse = qAclient.getAllQuestions(page,size);

        List<QuestionDto> content = allQuestionResponse.getContent();

        for (QuestionDto q : content){
            Optional<User> user=userRepository.findById(q.getAuthor_id());
            if (user.isEmpty()){
                throw new UserNotFoundException("user not found");
            }
            User db_user=user.get();
            q.setName(db_user.getFirstname());
            q.setLastName(db_user.getLastname());
            q.setUsername(db_user.getUsername());
            q.setProfileUrl(db_user.getUrlImage());
        }
        return allQuestionResponse;

    }

    public QuestionInfoDto getQuestionInfo(int id, int page){
        QuestionInfoDto questionInfoDto= qAclient.getQuestionInfo(id,page);
        Optional<User> user=userRepository.findById(questionInfoDto.getQuestion().getAuthor_id());
        if (user.isEmpty()){
            throw new UserNotFoundException("user not found");
        }
        User db_user=user.get();
        questionInfoDto.getQuestion().setName(db_user.getFirstname());
        questionInfoDto.getQuestion().setLastName(db_user.getLastname());
        questionInfoDto.getQuestion().setUsername(db_user.getUsername());
        questionInfoDto.getQuestion().setProfileUrl(db_user.getUrlImage());
        return questionInfoDto;
    }
}
