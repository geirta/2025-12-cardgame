package ee.geir.cardgame.repository;

import ee.geir.cardgame.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByPlayer_IdOrderByScoreDesc(Long id);
}
