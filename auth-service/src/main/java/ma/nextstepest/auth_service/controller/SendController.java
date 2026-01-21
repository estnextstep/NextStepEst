package ma.nextstepest.auth_service.controller;



import ma.nextstepest.auth_service.service.MessageProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SendController {

    private final MessageProducer producer;

    public SendController(MessageProducer producer) {
        this.producer = producer;
    }

    @GetMapping("/send")
    public String send(@RequestParam String msg) {
        producer.sendMessage(msg);
        return "Message sent: " + msg;
    }
}