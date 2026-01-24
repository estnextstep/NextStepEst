package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.ExperienceRequest;
import ma.nextstepest.auth_service.dto.MessageResponse;
import ma.nextstepest.auth_service.exception.UserNotAllowed;
import ma.nextstepest.auth_service.service.ExperienceService;
import org.springframework.web.bind.annotation.*;

@RestController
public class ExperienceController {

    private  final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService){
        this.experienceService = experienceService;
    }

    @PostMapping("/experience/add")
    public MessageResponse addExperience(@RequestBody ExperienceRequest experienceRequest){
        MessageResponse message = new MessageResponse();
        boolean works = experienceService.addExperience(experienceRequest);
        if (!works){
            throw new UserNotAllowed("you are not allowed, exp already exist or role student");
        }
        message.setMessage("your experience added by success");
        return message;
    }

    @GetMapping("/experience/{user_id}")
    public MessageResponse deleteExperience(@PathVariable Integer user_id){
        MessageResponse message = new MessageResponse();
        boolean works = experienceService.deleteExperience(user_id);
        if (!works){
            throw new UserNotAllowed("you are not allowed, you cant delete it");
        }
        message.setMessage("your experience deleted by success");
        return message;
    }

    @PostMapping("/experience/update")
    public MessageResponse updateExperience(@RequestBody ExperienceRequest experienceRequest){
        MessageResponse message = new MessageResponse();
        boolean works = experienceService.updateExperience(experienceRequest);
        if (!works){
            throw new UserNotAllowed("you are not allowed, you cant update it");
        }
        message.setMessage("your experience updated by success");
        return message;
    }
}