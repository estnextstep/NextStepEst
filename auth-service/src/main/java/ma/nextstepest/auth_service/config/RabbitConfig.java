package ma.nextstepest.auth_service.config;

import ch.qos.logback.classic.pattern.MessageConverter;
import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public TopicExchange emailExchange() {
        return new TopicExchange("email.exchange");
    }

    @Bean TopicExchange experienceExchange(){
        return new TopicExchange("experience.exchange");
    }

    @Bean
    public TopicExchange qaExchange(){
        return new TopicExchange("qa.exchange");
    }



}

