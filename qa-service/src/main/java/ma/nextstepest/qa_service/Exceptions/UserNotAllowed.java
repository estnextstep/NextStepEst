package ma.nextstepest.qa_service.Exceptions;

public class UserNotAllowed extends RuntimeException {
    public UserNotAllowed(String message) {
        super(message);
    }
}
