package ma.nextstepest.auth_service.dto;

public class ChangeRequest {
    public Integer user_id;
    public String reset_token;
    public String new_password;
    private String confirme_password;
}