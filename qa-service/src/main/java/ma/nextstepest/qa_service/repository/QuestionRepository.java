package ma.nextstepest.qa_service.repository;

import ma.nextstepest.qa_service.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question,Integer> {
}
