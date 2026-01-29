package ma.nextstepest.auth_service.controller;



import ma.nextstepest.auth_service.service.MessageProducer;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SendController {

    private final MessageProducer producer;

    public SendController(MessageProducer producer) {
        this.producer = producer;
    }


}