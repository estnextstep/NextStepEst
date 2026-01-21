package ma.nextstepest.email_notification_service.service;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class MessageConsumer {

    @RabbitListener(queues = "demo.queue")
    public void receiveMessage(String message) {
        System.out.println("📩 Received message: " + message);
    }
}