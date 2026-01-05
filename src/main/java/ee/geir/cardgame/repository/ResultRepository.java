package ee.geir.cardgame.repository;

import ee.geir.cardgame.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {
}
