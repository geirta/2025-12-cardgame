package ee.geir.cardgame.controller;

import ee.geir.cardgame.repository.ResultRepository;
import ee.geir.cardgame.entity.Result;
import ee.geir.cardgame.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ResultService resultService;

    @PostMapping("results")
    public List<Result> addResult(@RequestBody String name) {
        return resultService.addResult(name);
    }

    @GetMapping("results")
    public List<Result> getResults() {
        return resultRepository.findAll();
    }

}
