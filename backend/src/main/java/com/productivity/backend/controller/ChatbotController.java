package com.productivity.backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatbotController {

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private static final String API_KEY = "AIzaSyDO1yeHsvNxjWl2xTnvHOnmd3_rlUZCyFI";
    @PostMapping
public ResponseEntity<Map<String, String>> chatWithGemini(@RequestBody Map<String, String> payload) {
    try {
        String userMessage = payload.get("message");
        System.out.println("User message: " + userMessage); // 👈 log the incoming message

        // Prepare request body
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", userMessage)))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_API_URL + "?key=" + API_KEY;

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        System.out.println("Gemini raw response: " + response.getBody());

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || !responseBody.containsKey("candidates")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("reply", "No response from Gemini."));
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
        String reply = parts.get(0).get("text");

        return ResponseEntity.ok(Map.of("reply", reply));

    } catch (Exception e) {
        e.printStackTrace(); // 👈 print the full error in backend logs
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("reply", "Error: " + e.getMessage()));
    }
}

}
