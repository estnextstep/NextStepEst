package ma.nextstepest.experience_service.Excpetions;

import ma.nextstepest.experience_service.dto.Errorsdto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExperienceNotfoundException.class)
    public ResponseEntity<Errorsdto> handleNotFound(ExperienceNotfoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new Errorsdto(false, ex.getMessage()));
    }


}

