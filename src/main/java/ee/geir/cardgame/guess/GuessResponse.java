package ee.geir.cardgame.guess;

public record GuessResponse(GuessResult status, String nextCardName, int nextStrength, int score, int lives) {
}
