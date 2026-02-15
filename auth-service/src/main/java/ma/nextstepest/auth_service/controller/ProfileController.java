package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.Request.ChangePasswordReq;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.dto.Request.UpdateProfile;
import ma.nextstepest.auth_service.dto.Response.UserInfoResponse;
import ma.nextstepest.auth_service.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
public class ProfileController {


    private final AuthService authservice;


    public ProfileController(AuthService authservice) {
        this.authservice = authservice;

    }

    @GetMapping("/me")
    public UserInfoResponse GetUserInfo(){
        return authservice.get_userinfo();
    }

    @PatchMapping(value="/me/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MessageResponse updateUserinfo(
            @ModelAttribute UpdateProfile updateProfile,
            @RequestParam(required = false) MultipartFile image
    )throws IOException {
        return authservice.UpdateUserInfo(updateProfile,image);
    }

    @GetMapping("/profile/{username}")
    public UserInfoResponse getProfile(@PathVariable String username){
        return authservice.get_profile(username);
    }

    @PutMapping("/me/edit/change-password")
    public MessageResponse ChangeUserPassword(@RequestBody ChangePasswordReq changePasswordReq){
        return authservice.updatepassword(changePasswordReq);
    }

    @DeleteMapping("/user/delete")
    public MessageResponse deleteUser(){
        return authservice.deleteUser();
    }

}
