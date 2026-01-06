package ee.geir.cardgame.controller;

import ee.geir.cardgame.service.GameService;
import ee.geir.cardgame.guess.GuessRequest;
import ee.geir.cardgame.guess.GuessResponse;
import ee.geir.cardgame.startround.StartRoundResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
@AllArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("start")
    public StartRoundResponse startRound() {
        return gameService.startRound();
    }

    @PostMapping("guess")
    public GuessResponse getGuessResponse(@RequestBody GuessRequest request) {
        return gameService.getGuessResponse(request.guess());
    }

}
