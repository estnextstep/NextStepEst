package ma.nextstepest.qa_service.repository;


import ma.nextstepest.qa_service.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question,Integer> {
    void deleteByAuthorId(Long authorId);

    List<Question> findByAuthorId(long id);
    Page<Question> findByAuthorId(int authorId, Pageable pageable);
}
