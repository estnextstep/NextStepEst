package ma.nextstepest.qa_service.config;


import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // add question
    public static final String EXCHANGE = "qa.exchange";
    public static final String QUEUE = "createQst.queue";

    // add && delete answer
    public static final String QUEUE_an = "createAns.queue";



    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queue() {
        return QueueBuilder.durable(QUEUE).build();
    }

    @Bean
    public Queue queueAddAnswer(){
        return QueueBuilder.durable(QUEUE_an).build();
    }


    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with("create.question");
    }



    @Bean
    public Binding bindingAddAnswer(){
        return BindingBuilder
                .bind(queueAddAnswer())
                .to(exchange())
                .with("create.answer");
    }

}

