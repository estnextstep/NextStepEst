package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.Request.QuestionRequest;
import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.AnswerResponse;
import ma.nextstepest.auth_service.dto.Response.QuestionDto;
import ma.nextstepest.auth_service.dto.Response.QuestionInfoDto;

import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.exception.UserNotFoundException;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

        QuestionInfoDto questionInfoDto = qAclient.getQuestionInfo(id,page);

        // question author
        Optional<User> user = userRepository.findById(questionInfoDto.getQuestion().getAuthor_id());

        if (user.isEmpty()){
            throw new UserNotFoundException("user not found");
        }

        User db_user = user.get();

        questionInfoDto.getQuestion().setName(db_user.getFirstname());
        questionInfoDto.getQuestion().setLastName(db_user.getLastname());
        questionInfoDto.getQuestion().setUsername(db_user.getUsername());
        questionInfoDto.getQuestion().setProfileUrl(db_user.getUrlImage());

        // answers
        List<AnswerResponse> answers = questionInfoDto.getAnswers();

        List<Integer> authorIds = answers.stream()
                .map(AnswerResponse::getAuthorId)
                .distinct()
                .toList();

        Map<Integer, User> usersMap = userRepository.findAllById(authorIds)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        answers.forEach(answer -> {

            User u = usersMap.get(answer.getAuthorId());

            if (u != null){
                answer.setFirstName(u.getFirstname());
                answer.setLastName(u.getLastname());
                answer.setUsername(u.getUsername());
                answer.setImgUrl(u.getUrlImage());
                answer.setAlumniId(u.getId());
            }

        });

        return questionInfoDto;
    }
}
