package ma.nextstepest.email_notification_service.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class EmailDtoAuth {

    private String to;
    private String subject;
    private String content;

}
