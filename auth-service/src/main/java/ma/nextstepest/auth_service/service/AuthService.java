package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.dto.*;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.exception.EmailExisteException;
import ma.nextstepest.auth_service.exception.UserNotFoundException;
import ma.nextstepest.auth_service.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
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
            throw new UserNotFoundException("you don't have an account,Try create new");
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

}