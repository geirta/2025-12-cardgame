package ee.geir.cardgame.service;

import ee.geir.cardgame.entity.Player;
import ee.geir.cardgame.entity.Result;
import ee.geir.cardgame.repository.PlayerRepository;
import ee.geir.cardgame.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;
    @Autowired
    private GameService gameService;
    @Autowired
    private PlayerRepository playerRepository;

    public List<Result> addResult(String name) {

        Player player = playerRepository.findByName(name);

        if (player == null) {
            player = new Player();
            player.setName(name);
            playerRepository.save(player);
        }

        Result res = new Result();
        res.setPlayer(player);
        res.setScore(gameService.getState().getScore());
        res.setTimePlayed(gameService.getState().getGameDurationInSeconds());

        resultRepository.save(res);
        return resultRepository.findAll();
    }

}
