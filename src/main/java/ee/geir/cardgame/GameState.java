package ee.geir.cardgame;

import lombok.Data;

import java.time.Instant;

@Data
public class GameState {
    private Card baseCard;
    private int score = 0;
    private int lives = 3;
    private Instant roundStart;
    private long gameDurationInSeconds;
}
