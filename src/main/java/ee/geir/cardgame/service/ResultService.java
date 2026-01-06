package ee.geir.cardgame.service;

import ee.geir.cardgame.entity.Result;
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

    public List<Result> addResult(String name) {
        Result res = new Result();
        res.setPlayerName(name);
        res.setScore(gameService.getState().getScore());
        res.setTimePlayed(gameService.getState().getGameDurationInSeconds());
        resultRepository.save(res);
        return resultRepository.findAll();
    }

}
