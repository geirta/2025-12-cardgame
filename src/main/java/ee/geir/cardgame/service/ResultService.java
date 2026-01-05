package ee.geir.cardgame.service;

import ee.geir.cardgame.GameState;
import ee.geir.cardgame.entity.Result;
import ee.geir.cardgame.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    public List<Result> addResult(String name) {
//        Result res = new Result();
//        res.setName(name);
//        res.setScore(gameState.getScore());
//        res.setTimePlayed(gameState.getGameDurationInSeconds());
//        resultRepository.save(res);
        return resultRepository.findAll();
    }

}
