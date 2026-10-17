package ma.nextstepest.experience_service.repository;

import ma.nextstepest.experience_service.entity.Experience;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ExperienceRepository extends JpaRepository<Experience, Integer> {

    Experience findByAlumniId(String alumniId);

}
