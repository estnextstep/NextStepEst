package ma.nextstepest.auth_service.exception;

public class PasswordNotMuchException extends RuntimeException {
    public PasswordNotMuchException(String message) {
        super(message);
    }
}
