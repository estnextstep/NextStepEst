package ma.nextstepest.qa_service.config;


import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // add question
    public static final String EXCHANGE = "qa.exchange";
    public static final String QUEUE = "create.queue";

    // delete question

    public static final String QUEUE_V2 = "deleteQa.queue";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queue() {
        return QueueBuilder.durable(QUEUE).build();
    }


    @Bean
    public Queue queueDelete(){
        return QueueBuilder.durable(QUEUE_V2).build();
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with("create.question");
    }

    @Bean
    public Binding bindingDelete(){
        return BindingBuilder
                .bind(queueDelete())
                .to(exchange())
                .with("delete.question");
    }



}

