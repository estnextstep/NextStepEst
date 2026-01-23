package ma.nextstepest.email_notification_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import ma.nextstepest.email_notification_service.dto.EmailDtoAuth;
import ma.nextstepest.email_notification_service.entity.EmailNotification;
import ma.nextstepest.email_notification_service.repository.EmailNotificationRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final EmailNotificationRepository emailNotificationRepository;
    private final JavaMailSender javaMailSender;
    public EmailSenderService(EmailNotificationRepository emailNotificationRepository, JavaMailSender javaMailSender){
        this.emailNotificationRepository = emailNotificationRepository;
        this.javaMailSender = javaMailSender;
    }
    @Async
    public void sendEmail(EmailNotification db_mail, EmailDtoAuth emailDtoAuth) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(db_mail.getToEmail());
            helper.setSubject(db_mail.getSubject());
            helper.setFrom("estnextstep@gmail.com");

            String confirmationLink = emailDtoAuth.getContent();
            String htmlContent;
            if (emailDtoAuth.getSubject().equals("email to activate your account")) {
                htmlContent = "<h1>Welcome!</h1>"
                        //  + "<p>Click the link below to confirm your account:</p>"
                        + "<p>" + db_mail.getSubject() + "</p>"
                        + "<a href=" + confirmationLink + ">Confirm Account</a>";
            } else {
                htmlContent = """
                            <h2>Your OTP Code </h2>
                            <p>Use this code to continue:</p>
                            <p>This code expires in 10 minutes.</p>
                        """ + confirmationLink;
            }

            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            db_mail.setSend_at(java.time.LocalDateTime.now());

            emailNotificationRepository.save(db_mail);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }


    }

}
