package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.AuthResponse;
import ma.nextstepest.auth_service.dto.MessageResponse;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private  AuthService authservice;


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

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "TOKEN VALID ";
    }
}
