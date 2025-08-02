package com.productivity.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class CommunicationTestRequest {
    private String email;
    private List<String> prompts;
    private List<String> responses;

    // Getters and Setters
}
