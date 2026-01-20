package ma.nextstepest.auth_service.exception;


import ma.nextstepest.auth_service.dto.Errorsdto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EmailExisteException.class)
    public ResponseEntity<Errorsdto> HandleEmailExiste(EmailExisteException em){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new Errorsdto(false,em.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Errorsdto> HandleEmailExiste(UserNotFoundException em){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new Errorsdto(false,em.getMessage()));
    }

    @ExceptionHandler(PasswordNotMuchException.class)
    public ResponseEntity<Errorsdto> HandleEmailExiste(PasswordNotMuchException em){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new Errorsdto(false,em.getMessage()));
    }

    @ExceptionHandler(TokenInvalidException.class)
    public ResponseEntity<Errorsdto> HandleEmailExiste(TokenInvalidException em){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new Errorsdto(false,em.getMessage()));
    }

    @ExceptionHandler(DataInvalidException.class)
    public ResponseEntity<Errorsdto> HandleEmailExiste(DataInvalidException em){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new Errorsdto(false,em.getMessage()));
    }
    @ExceptionHandler(AccountNotActiveException.class)
    public ResponseEntity<Errorsdto> HandleEmailExiste(AccountNotActiveException em){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new Errorsdto(false,em.getMessage()));
    }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Errorsdto> HandleRequest(BadRequestException br){
        return ResponseEntity.status(HttpStatus.CONFLICT).body((
                new Errorsdto(false,br.getMessage())
                ));
    }
}