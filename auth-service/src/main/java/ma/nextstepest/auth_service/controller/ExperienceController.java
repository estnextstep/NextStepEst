package ma.nextstepest.auth_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExperienceController {

    @PostMapping("/experience/add")
    public void addExperience(){

    }

    @GetMapping("/experience/{user_id}")
    public void deleteExperience(@PathVariable Integer user_id){

    }

    @PostMapping("/experience/update")
    public void updateExperience(){

    }
}