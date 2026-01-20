package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.*;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.service.AuthService;
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

    @PostMapping("/logout")
    public MessageResponse logout(@RequestHeader("Authorization") String token){
        return  authservice.logout(token);
    }

    @PostMapping("/reset-password")
    public Object resetPassword(@RequestBody ResetRequest resetRequest) {
        return authservice.resetPassword(resetRequest);
    }

    @PostMapping("/change-password")
    public MessageResponse changePassword(@RequestBody ChangeRequest changeRequest){
        return authservice.changePassword(changeRequest);
    }

    @GetMapping("/activate/{token}/{id}")
    public MessageResponse activate(@PathVariable String token,@PathVariable Integer id){
        return authservice.active(token,id);
    }
    @GetMapping("/me")
    public UserInfoResponse GetUserInfo(@RequestHeader("Authorization") String token){
        return authservice.Getuserinfo(token);
    }
    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "TOKEN VALID ";
    }
}
