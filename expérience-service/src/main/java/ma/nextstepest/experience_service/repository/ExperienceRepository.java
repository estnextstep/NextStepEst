package ma.nextstepest.experience_service.repository;

import ma.nextstepest.experience_service.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExperienceRepository extends JpaRepository<Experience, Integer> {

    Experience findByAlumniId(String alumniId);
}
