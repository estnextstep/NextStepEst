package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.config.RabbitConfig;
import ma.nextstepest.auth_service.dto.EmailDtoAuth;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class MessageProducer {

    private final RabbitTemplate rabbitTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    public MessageProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendEmail(EmailDtoAuth email_dto) {
        String json = objectMapper.writeValueAsString(email_dto);
        rabbitTemplate.convertAndSend(
                "email.exchange",
                "email.user.created",
                json
        );
    }
}