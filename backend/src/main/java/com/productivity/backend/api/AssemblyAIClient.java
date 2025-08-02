// AssemblyAIClient.java
package com.productivity.backend.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class AssemblyAIClient {
    private String apiKey="your api key";

    private final RestTemplate restTemplate = new RestTemplate();

    public String transcribeAudio(String audioUrl) {
        try {
            // Step 1: Submit transcription request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("audio_url", audioUrl);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            Map<String, Object> response = restTemplate.postForObject(
                "https://api.assemblyai.com/v2/transcript",
                request,
                Map.class
            );

            String transcriptId = (String) response.get("id");

            // Step 2: Poll until completed
            String status;
            String transcriptText = "";
            String pollingUrl = "https://api.assemblyai.com/v2/transcript/" + transcriptId;

            do {
                Thread.sleep(3000); // Wait before polling
                ResponseEntity<Map> pollingResponse = restTemplate.exchange(
                    pollingUrl,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
                );

                Map<String, Object> pollingBody = pollingResponse.getBody();
                status = (String) pollingBody.get("status");
                if ("completed".equals(status)) {
                    transcriptText = (String) pollingBody.get("text");
                    break;
                } else if ("error".equals(status)) {
                    throw new RuntimeException("AssemblyAI transcription failed");
                }
            } while (!"completed".equals(status));

            return transcriptText;

        } catch (Exception e) {
            e.printStackTrace();
            return "[Transcription failed]";
        }
    }
}
