package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.Request.ChangePasswordReq;
import ma.nextstepest.auth_service.dto.Response.AllQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.AllUserQuestionResponse;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.dto.Request.UpdateProfile;
import ma.nextstepest.auth_service.dto.Response.UserInfoResponse;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import ma.nextstepest.auth_service.service.AuthService;
import ma.nextstepest.auth_service.service.QuestionService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
public class ProfileController {


    private final AuthService authservice;
    private final QuestionService questionService;
    private final UserRepository userRepository;

    public ProfileController(AuthService authservice, QuestionService questionService, UserRepository userRepository) {
        this.authservice = authservice;

        this.questionService = questionService;
        this.userRepository = userRepository;
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

    @GetMapping("/user/questions")
    public AllUserQuestionResponse getUserQuestion(@RequestParam int user_id,@RequestParam int page){
        return questionService.getUserQuestions(user_id,page);
    }

}
