package tn.esprit.contractmanegement.Service;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiEmailContentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String OPENAI_API_KEY = "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"; // Remplace par ta clé OpenAI
    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String generateEmailContent(String consultationDescription) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_API_KEY);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", "Rédige un email professionnel pour informer un client qu'un expert a été assigné à sa consultation. Détail de la consultation : " + consultationDescription);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", new Map[]{message});
        requestBody.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map responseBody = response.getBody();
            String generatedContent = (String) ((Map)((Map)((java.util.List) responseBody.get("choices")).get(0)).get("message")).get("content");
            return generatedContent.trim();
        } else {
            throw new RuntimeException("Erreur lors de la génération du contenu IA : " + response.getStatusCode());
        }
    }
}
