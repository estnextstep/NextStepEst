package ma.nextstepest.auth_service.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserNotFoundException  extends RuntimeException{
    public UserNotFoundException (String message){
        super(message);
    }
}