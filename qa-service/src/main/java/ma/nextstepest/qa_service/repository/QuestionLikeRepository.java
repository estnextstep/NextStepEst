package ma.nextstepest.qa_service.repository;

import ma.nextstepest.qa_service.entity.QuestionLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionLikeRepository  extends JpaRepository<QuestionLike,Integer> {
}
