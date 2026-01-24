package ma.nextstepest.experience_service.config;


import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // add experience
    public static final String EXCHANGE = "experience.exchange";
    public static final String QUEUE = "add.queue";

    // delete experience

    public static final String QUEUE_V2 = "delete.queue";

    // update experience

    public static final String QUEUE_V3 = "update.queue";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queue() {
        return QueueBuilder.durable(QUEUE).build();
    }

    @Bean
    public Queue deleteQueue() {
        return QueueBuilder.durable(QUEUE_V2).build();
    }

    @Bean
    public Queue updateQueue() {
        return QueueBuilder.durable(QUEUE_V3).build();
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with("experience.ajouter");
    }

    @Bean
    public Binding deleteBinding(){
        return BindingBuilder
                .bind(deleteQueue())
                .to(exchange())
                .with("experience.delete");
    }

    @Bean
    public Binding updteBinding(){
        return BindingBuilder
                .bind(updateQueue())
                .to(exchange())
                .with("experience.update");
    }
}
