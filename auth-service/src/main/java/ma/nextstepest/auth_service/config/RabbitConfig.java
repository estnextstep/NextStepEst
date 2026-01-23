package ma.nextstepest.auth_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    @Bean
    public TopicExchange emailExchange() {
        return new TopicExchange("email.exchange");
    }

}
