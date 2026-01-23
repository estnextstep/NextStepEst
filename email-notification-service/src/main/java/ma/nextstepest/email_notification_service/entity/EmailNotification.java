package ma.nextstepest.email_notification_service.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "emails")
public class EmailNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String toEmail;
    private String subject;
    private String content;
    private LocalDateTime created_at;
    private LocalDateTime send_at;


}
