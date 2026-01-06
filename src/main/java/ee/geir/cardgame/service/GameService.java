package ee.geir.cardgame.service;

import ee.geir.cardgame.Card;
import ee.geir.cardgame.GameState;
import ee.geir.cardgame.guess.Guess;
import ee.geir.cardgame.guess.GuessResponse;
import ee.geir.cardgame.guess.GuessResult;
import ee.geir.cardgame.startround.StartRoundResponse;
import lombok.Getter;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service
@SessionScope
public class GameService {

    private static final List<Card> cardDeck = List.of(Card.values());
    private static final int deckSize = cardDeck.size();
    private static final Random rand = new Random();

    @Getter
    private final GameState state = new GameState();

    public StartRoundResponse startRound() {
        state.setBaseCard(getCard());
        state.setGameStart(Instant.now());
        state.setRoundStart(Instant.now());
        state.setScore(0);
        state.setLives(3);
        return new StartRoundResponse(state.getBaseCard().name, state.getBaseCard().strength);
    }

    public GuessResponse getGuessResponse(Guess guess) {

        Instant guessReceivedTime = Instant.now();
        //System.out.println("Game length: " + (guessReceivedTime.getEpochSecond() - state.getGameStart().getEpochSecond()));
        long elapsedTime = guessReceivedTime.getEpochSecond() - state.getRoundStart().getEpochSecond();
        if (elapsedTime > 10 || guess == Guess.NONE) {
            System.out.println("check, times up");
            state.setGameDurationInSeconds(Math.max(0, Duration.between(state.getGameStart(), guessReceivedTime).getSeconds()));
            System.out.println("m2nguaeg: " + state.getGameDurationInSeconds());
            return new GuessResponse(GuessResult.TIME_OUT, null, 0, state.getScore(), state.getLives());
        }

        Card nextCard = getCard();
        System.out.println(nextCard);
        boolean correct = switch (guess) {
            case HIGHER -> nextCard.strength > state.getBaseCard().strength;
            case EQUAL -> nextCard.strength == state.getBaseCard().strength;
            case LOWER -> nextCard.strength < state.getBaseCard().strength;
            default -> false;
        };

        if (correct) {
            state.setScore(state.getScore() + 1);
        } else {
            state.setLives(state.getLives() - 1);
        }

        state.setBaseCard(nextCard);
        state.setRoundStart(Instant.now());

        if (state.getLives() == 0) {
            System.out.println("check, game over because incorrect choice");
            state.setGameDurationInSeconds(Math.max(0, Duration.between(state.getGameStart(), guessReceivedTime).getSeconds()));
            return new GuessResponse(GuessResult.GAME_OVER, null, 0, state.getScore(), state.getLives());
        }

        return new GuessResponse(
                correct ? GuessResult.CORRECT : GuessResult.WRONG,
                nextCard.name,
                nextCard.strength,
                state.getScore(),
                state.getLives()
        );
    }

    private Card getCard() {

        Card baseCard = cardDeck.get(rand.nextInt(deckSize));
        Card card;

        do {
            card = cardDeck.get(rand.nextInt(deckSize));
        } while (baseCard != null && card == baseCard);

        return card;
    }

}
