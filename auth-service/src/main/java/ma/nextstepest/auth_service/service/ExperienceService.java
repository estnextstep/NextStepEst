package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.ExperienceRequest;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Service
public class ExperienceService {

    private final UserRepository userRepository;
    private final MessageProducer messageProducer;
    private final ExperienceClient experienceClient;
    public ExperienceService(UserRepository userRepository,
                             MessageProducer messageProducer, ExperienceClient experienceClient){
        this.userRepository = userRepository;
        this.messageProducer = messageProducer;

        this.experienceClient = experienceClient;
    }
    public Mono<ExperienceRequest> getexperience(String email){
        return Mono.fromCallable(()->userRepository.findByEmail(email))
                .flatMap(user->{
                    if(user==null) return Mono.error(new RuntimeException("user not found "));
                    return experienceClient.getExperience(user.getId());
                });
    }
    public boolean addExperience(ExperienceRequest experienceRequest) {
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User db_user = userRepository.findByEmail(email);
        if (!db_user.isExpr() && db_user.getRole().equals("ALUMNI")){
            experienceRequest.setAlumniId(db_user.getId());
            messageProducer.addExperience(experienceRequest);
            db_user.setExpr(true);
            userRepository.save(db_user);
            return true;
        }else {
            return false;
        }
    }

    public boolean deleteExperience(Integer userId) {
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User db_user = userRepository.findByEmail(email);
        if (db_user.isExpr() && db_user.getRole().equals("ALUMNI") && Objects.equals(db_user.getId(), userId)){
            messageProducer.deleteExperience(String.valueOf(userId));
            db_user.setExpr(false);
            userRepository.save(db_user);
            return true;
        }else {
            return false;
        }
    }

    public boolean updateExperience(ExperienceRequest experienceRequest) {
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User db_user = userRepository.findByEmail(email);
        if (!db_user.isExpr() || !db_user.getRole().equals("ALUMNI")){
            return false;
        }
        if(!db_user.getId().equals(experienceRequest.getAlumniId())){
            return false;
        }
        messageProducer.updateExperience(experienceRequest);
        return true;
                }
                }
