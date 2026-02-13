package ma.nextstepest.auth_service.dto;

public record Errorsdto(boolean success, String message) {
    public Errorsdto(String message, boolean success) {
        this(success, message);
    }
}