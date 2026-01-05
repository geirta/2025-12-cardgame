package ee.geir.cardgame.controller;

import ee.geir.cardgame.repository.ResultRepository;
import ee.geir.cardgame.entity.Result;
import ee.geir.cardgame.service.ResultService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
@AllArgsConstructor
@NoArgsConstructor
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ResultService resultService;

    @PostMapping("results22")
    public List<Result> addResult(@RequestBody String name) {
        resultService.addResult(name);
        return resultRepository.findAll();
    }

    @GetMapping("results")
    public List<Result> getResults() {
        return resultRepository.findAll();
    }

}
