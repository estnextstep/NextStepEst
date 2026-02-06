package ma.nextstepest.qa_service.repository;

import ma.nextstepest.qa_service.entity.Answer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository  extends JpaRepository<Answer,Integer> {
    Page<Answer> findAllByQuestionId(int questionId, Pageable pageable);
}
