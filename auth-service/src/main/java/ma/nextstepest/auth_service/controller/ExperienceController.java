package ma.nextstepest.auth_service.controller;

import ma.nextstepest.auth_service.dto.Response.AllExperiencesResponse;
import ma.nextstepest.auth_service.dto.Request.ExperienceRequest;
import ma.nextstepest.auth_service.dto.Response.AllExperiencesRocom;
import ma.nextstepest.auth_service.dto.Response.MessageResponse;
import ma.nextstepest.auth_service.exception.UserNotAllowed;
import ma.nextstepest.auth_service.service.ExperienceClient;
import ma.nextstepest.auth_service.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ExperienceController {

    private  final ExperienceService experienceService;
    private final ExperienceClient experienceClient;
    public ExperienceController(ExperienceService experienceService, ExperienceClient experienceClient){
        this.experienceService = experienceService;
        this.experienceClient = experienceClient;
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

    @DeleteMapping("/experience/{user_id}")
    public ResponseEntity deleteExperience(@PathVariable Integer user_id){

        return experienceClient.deleteExperience(user_id);

    }

    @PutMapping("/experience/update")
    public MessageResponse updateExperience(@RequestBody ExperienceRequest experienceRequest){
        MessageResponse message = new MessageResponse();
        boolean works = experienceService.updateExperience(experienceRequest);
        if (!works){
            throw new UserNotAllowed("you are not allowed, you cant update it");
        }
        message.setMessage("your experience updated by success");
        return message;
    }

    @GetMapping("/experiences")
    public AllExperiencesResponse getAllExperience(@RequestParam Integer page){
            int size = 6;
            return experienceService.getAll(page,size);
    }

    @GetMapping("/experiences/recomandation")
    public AllExperiencesRocom getRecommendedExperience(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size){
        return experienceService.getRecommendedExperience(page, size);
    }
}