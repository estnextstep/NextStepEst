package ma.nextstepest.email_notification_service.service;


import ma.nextstepest.email_notification_service.dto.EmailDtoAuth;
import ma.nextstepest.email_notification_service.dto.TopFiliereResponse;
import ma.nextstepest.email_notification_service.entity.EmailNotification;
import ma.nextstepest.email_notification_service.repository.EmailNotificationRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class EmailNotificationService {

    private final EmailSenderService emailSenderService;
    private final EmailNotificationRepository emailNotificationRepository;

    public EmailNotificationService(EmailSenderService emailSenderService,
                                    EmailNotificationRepository emailNotificationRepository, JavaMailSender javaMailSender){
        this.emailSenderService =emailSenderService;
        this.emailNotificationRepository = emailNotificationRepository;
    }

    @RabbitListener(queues = "email.queue")
    public void receiveMessage(String message) {
        try{
            EmailDtoAuth emailDtoAuth = new ObjectMapper().readValue(message, EmailDtoAuth.class);
            EmailNotification dbmail = new EmailNotification();
            dbmail.setContent(emailDtoAuth.getContent());
            dbmail.setToEmail(emailDtoAuth.getTo());
            dbmail.setSubject(emailDtoAuth.getSubject());
            dbmail.setCreated_at(java.time.LocalDateTime.now());
            emailNotificationRepository.save(dbmail);
            emailSenderService.sendEmail(dbmail,emailDtoAuth);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    @RabbitListener(queues = "email.recommand.queue")
    public void receiveMessageRecommend(String message){
        TopFiliereResponse topFiliereResponse = new ObjectMapper().readValue(message, TopFiliereResponse.class);
        emailSenderService.sendEmailRecommend(topFiliereResponse);
    }
}