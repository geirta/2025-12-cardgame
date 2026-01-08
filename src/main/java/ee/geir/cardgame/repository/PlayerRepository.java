package ee.geir.cardgame.repository;

import ee.geir.cardgame.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player,Long> {

    Player findByName(String name);
}
