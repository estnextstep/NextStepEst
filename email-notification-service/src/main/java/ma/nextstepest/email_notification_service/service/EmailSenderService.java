package ma.nextstepest.email_notification_service.service;

import ma.nextstepest.email_notification_service.dto.EmailDtoAuth;
import ma.nextstepest.email_notification_service.entity.EmailNotification;
import ma.nextstepest.email_notification_service.repository.EmailNotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final EmailNotificationRepository emailNotificationRepository;

    public EmailSenderService(EmailNotificationRepository emailNotificationRepository){
        this.emailNotificationRepository = emailNotificationRepository;
    }

    public void sendEmail(EmailNotification db_mail, EmailDtoAuth emailDtoAuth) {

        db_mail.setSend_at(java.time.LocalDateTime.now());

        emailNotificationRepository.save(db_mail);
    }

}
