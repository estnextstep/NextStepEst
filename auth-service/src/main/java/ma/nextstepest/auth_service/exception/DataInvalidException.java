package ma.nextstepest.auth_service.exception;

public class DataInvalidException extends RuntimeException {
    public DataInvalidException(String message) {
        super(message);
    }
}
