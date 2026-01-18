package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.AuthResponse;
import ma.nextstepest.auth_service.dto.ChangeRequest;
import ma.nextstepest.auth_service.dto.MessageResponse;
import ma.nextstepest.auth_service.dto.ResetRequest;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.service.AuthService;
import ma.nextstepest.auth_service.service.OtpService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authservice;


    public AuthController(AuthService authservice) {
        this.authservice = authservice;

    }

    @PostMapping("/register")
    public MessageResponse register(@RequestBody User user) {
        return authservice.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody User requestUser) {
        return authservice.login(requestUser);
    }

    @PostMapping("/reset-password")
    public Object resetPassword(@RequestBody ResetRequest resetRequest) {
        return authservice.resetPassword(resetRequest);
    }

    @PostMapping("/change-password")
    public MessageResponse changePassword(@RequestBody ChangeRequest changeRequest){
        return authservice.changePassword(changeRequest);
    }

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "TOKEN VALID ";
    }
}
