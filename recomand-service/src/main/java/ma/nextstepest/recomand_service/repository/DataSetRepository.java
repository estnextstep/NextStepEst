package ma.nextstepest.recomand_service.repository;

import ma.nextstepest.recomand_service.entity.DataSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DataSetRepository extends JpaRepository<DataSet, Integer> {
    Optional<DataSet> findByAuthorId(Integer authorId);
}
