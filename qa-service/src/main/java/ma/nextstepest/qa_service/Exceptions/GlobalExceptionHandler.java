package ma.nextstepest.qa_service.Exceptions;

import ma.nextstepest.qa_service.dto.Errorsdto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(QANotFoundException.class)
    public ResponseEntity<Errorsdto> handleNotFound(QANotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new Errorsdto(false, ex.getMessage()));
    }

    @ExceptionHandler(UserNotAllowed.class)
    public ResponseEntity<Errorsdto> handleForbidden(UserNotAllowed ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new Errorsdto(false, ex.getMessage()));
    }
}

