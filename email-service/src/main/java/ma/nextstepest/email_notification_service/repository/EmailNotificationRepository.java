package ma.nextstepest.email_notification_service.repository;

import ma.nextstepest.email_notification_service.entity.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Integer> {

}
