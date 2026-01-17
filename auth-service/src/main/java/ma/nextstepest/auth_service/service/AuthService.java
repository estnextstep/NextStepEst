package ma.nextstepest.auth_service.service;


import ma.nextstepest.auth_service.dto.*;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.exception.EmailExisteException;
import ma.nextstepest.auth_service.exception.UserNotFoundException;
import ma.nextstepest.auth_service.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService service;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       OtpService service) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.service = service;
    }

    public MessageResponse register(@RequestBody User user) {
        if(userRepository.findByEmail((Object) user.getEmail()).isPresent()){
            throw new EmailExisteException("Email Already exist !");
        }
        user.setActive(false);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        MessageResponse message = new MessageResponse();
        message.message = "Registered";
        return message;
    }

    public AuthResponse login(@RequestBody User requestUser) {
        AuthResponse authresponse = new AuthResponse();
        User dbUser = userRepository.findByEmail(requestUser.getEmail());
        if(!userRepository.findByEmail((Object) requestUser.getEmail()).isPresent()){
            throw new UserNotFoundException("you don't have an account,please register");
        }

        if (dbUser != null && passwordEncoder.matches(requestUser.getPassword(), dbUser.getPassword())) {
            String token = jwtService.generateToken(dbUser);
            authresponse.setToken(token);
            authresponse.setRole(dbUser.getRole());
            authresponse.setExperation(jwtService.getExpiration(token));
            return authresponse;
        }
        authresponse.setToken("Donneés invalid");
        return authresponse;
    }

    public MessageResponse resetPassword(@RequestBody ResetRequest resetRequest){
        Optional<User> optionalUser = userRepository.findByEmail((Object) resetRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("you don't have an account, please register");
        }

        User dbUser = optionalUser.get();


        MessageResponse message = new MessageResponse();
        if(resetRequest.getOTP() != null){
            boolean valid = service.validateOTP(dbUser,resetRequest.getOTP());
            if (valid){
                message.message = "your otp is right";
                service.invalidateOTP(dbUser);
                return message;
            }else{
                message.message = "your otp is expired or wrong";
                return message;
            }
        } else {
            String email = resetRequest.getEmail();
            Integer otp = service.generateOTP(dbUser);
            message.message = "an otp have been send to you , " + String.valueOf(otp);
            return message;
        }
    }

    public MessageResponse changePassword(@RequestBody ChangeRequest changeRequest){
        return null;
    }
}