package com.productivity.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class CommunicationResult {
    private int score;
    private String level;
    private String feedback;
    private List<String> tips;

    // Getters and Setters
}