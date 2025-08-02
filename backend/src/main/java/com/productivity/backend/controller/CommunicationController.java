package com.productivity.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.productivity.backend.dto.CommunicationResult;
import com.productivity.backend.dto.CommunicationTestRequest;
import com.productivity.backend.service.CommunicationService;

@RestController
@RequestMapping("/api/communication")
public class CommunicationController {

    @Autowired
    private CommunicationService communicationService;

    @PostMapping("/submit")
    public ResponseEntity<CommunicationResult> submit(@RequestBody CommunicationTestRequest request) {
        CommunicationResult result =communicationService.evaluate(request);
        return ResponseEntity.ok(result);
    }
}
