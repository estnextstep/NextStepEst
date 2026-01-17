package ma.nextstepest.auth_service.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class EmailExisteException  extends RuntimeException{
    public EmailExisteException (String message){
        super(message);
    }
}