package ma.nextstepest.recomand_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RecomandServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecomandServiceApplication.class, args);
	}

}
