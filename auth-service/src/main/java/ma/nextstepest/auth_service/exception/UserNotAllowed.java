package ma.nextstepest.auth_service.exception;

public class UserNotAllowed extends RuntimeException {
    public UserNotAllowed(String message) {
        super(message);
    }
}
