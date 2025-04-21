package tn.esprit.contractmanegement.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.contractmanegement.Dto.PromptRequest;

@RestController
@RequestMapping("/generate-response")
public class ResponseController {

    @PostMapping
    public String generateResponse(@RequestBody PromptRequest request) {
        return "Generated response for: " + request.getPrompt();
    }
}
