package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.*;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    @PutMapping(value="/me/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MessageResponse updateuUserinfo(
            @RequestParam String firstname,
            @RequestParam String lastname,
            @RequestParam String role,
            @RequestParam(required = false) MultipartFile image
    )throws IOException {
    return authservice.UpdateUserInfor(firstname,lastname,role,image);
    }
    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "TOKEN VALID ";
    }
}
