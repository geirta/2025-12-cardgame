package ee.geir.cardgame.controller;

import ee.geir.cardgame.repository.ResultRepository;
import ee.geir.cardgame.entity.Result;
import ee.geir.cardgame.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Page<Result> getResults(Pageable pageable) {
        return resultRepository.findAll(pageable);
    }

    @GetMapping("results/{id}")
    public List<Result> getPlayerResults(@PathVariable Long id) {
        return resultRepository.findByPlayer_IdOrderByScoreDesc(id);
    }

}
