package ma.nextstepest.email_notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "email.exchange";
    public static final String QUEUE = "email.queue";

    public static final String QUEUER = "email.recommand.queue";


    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queue() {
        return QueueBuilder.durable(QUEUE).build();
    }

    @Bean
    public Queue queueR() {
        return QueueBuilder.durable(QUEUER).build();
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with("email.#");
    }

    @Bean Binding bindingR(){
        return BindingBuilder
                .bind(queueR())
                .to(exchange())
                .with("email.recommand");
    }
}
