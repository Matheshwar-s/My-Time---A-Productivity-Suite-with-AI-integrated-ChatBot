// CommunicationService.java
package com.productivity.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.productivity.backend.api.AssemblyAIClient;
import com.productivity.backend.api.GeminiClient;
import com.productivity.backend.dto.CommunicationResult;
import com.productivity.backend.dto.CommunicationTestRequest;

@Service
public class CommunicationService {

    @Autowired
    private GeminiClient geminiClient;

    @Autowired
    private AssemblyAIClient assemblyAIClient;

    public CommunicationResult evaluate(CommunicationTestRequest request) {
        System.out.println("Received prompts: " + request.getPrompts());
        System.out.println("Received responses: " + request.getResponses());

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You're a communication coach. Evaluate the user's communication skills...\n\n");

        int count = Math.min(request.getPrompts().size(), request.getResponses().size());
        for (int i = 0; i < count; i++) {
            String audioUrl = request.getResponses().get(i);
            String transcript = assemblyAIClient.transcribeAudio(audioUrl);

            promptBuilder.append("Q: ").append(request.getPrompts().get(i)).append("\n");
            promptBuilder.append("A: ").append(transcript).append("\n\n");
        }

        promptBuilder.append("""
            Provide the result ONLY as valid JSON in this format:
            {
              "score": 8,
              "level": "Intermediate",
              "feedback": "...",
              "tips": ["...", "...", "..."]
            }
            Return ONLY the JSON.
        """);

        String responseJson = geminiClient.evaluate(promptBuilder.toString());
        System.out.println("Gemini raw output: " + responseJson);
        String cleanedJson = responseJson.trim();
if (cleanedJson.startsWith("```json")) {
    cleanedJson = cleanedJson.substring(7); // remove ```json
}
if (cleanedJson.endsWith("```")) {
    cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3); // remove ending ```
}
cleanedJson = cleanedJson.trim();
        ObjectMapper mapper = new ObjectMapper();
        CommunicationResult result;
        try {
            result = mapper.readValue(cleanedJson, CommunicationResult.class);
        } catch (Exception e) {
            System.err.println("JSON parsing failed:");
            e.printStackTrace();

            result = new CommunicationResult();
            result.setScore(0);
            result.setLevel("Unknown");
            result.setFeedback("Gemini evaluation failed.");
            result.setTips(List.of("Try again later."));
        }

        return result;
    }
}
