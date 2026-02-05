package ma.nextstepest.auth_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {


    @Bean
    public WebClient webClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8083") // experience-service
                .build();
    }
    @Bean (name = "qaWebClient")
    public WebClient WebClientQa(){
        return WebClient.builder()
                .baseUrl("http://localhost:8084") // Question answer service
                .build();
    }
}
