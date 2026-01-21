package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.ChangePasswordReq;
import ma.nextstepest.auth_service.dto.MessageResponse;
import ma.nextstepest.auth_service.dto.UserInfoResponse;
import ma.nextstepest.auth_service.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class ProfileController {


    private final AuthService authservice;


    public ProfileController(AuthService authservice) {
        this.authservice = authservice;

    }

    @GetMapping("/me")
    public UserInfoResponse GetUserInfo(@RequestHeader("Authorization") String token){
        return authservice.Getuserinfo(token);
    }

    @PutMapping(value="/me/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MessageResponse updateUserinfo(
            @RequestParam String firstname,
            @RequestParam String lastname,
            @RequestParam String role,
            @RequestParam String major,
            @RequestParam(required = false) MultipartFile image
    )throws IOException {
        return authservice.UpdateUserInfo(firstname,lastname,role,image,major);
    }

    @GetMapping("/profile/{username}")
    public UserInfoResponse getProfile(@PathVariable String username){
        return authservice.get_profile(username);
    }

    @PutMapping("/me/edit/change-password")
    public MessageResponse ChangeUserPassword(@RequestBody ChangePasswordReq changePasswordReq){
        return authservice.updatepassword(changePasswordReq);
    }

}
