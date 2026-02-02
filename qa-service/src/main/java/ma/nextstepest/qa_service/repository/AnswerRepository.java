package ma.nextstepest.qa_service.repository;

import ma.nextstepest.qa_service.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository  extends JpaRepository<Answer,Integer> {
}
