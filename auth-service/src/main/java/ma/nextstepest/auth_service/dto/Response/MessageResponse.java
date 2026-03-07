package ma.nextstepest.auth_service.dto.Response;

import lombok.Data;

@Data
public class MessageResponse {
    public MessageResponse(){

    }
    public MessageResponse(boolean success){
        this.success = success;
    }
    public MessageResponse(String message){
        this.message = message;
    }
    private boolean success = true;
    private String message;
}
