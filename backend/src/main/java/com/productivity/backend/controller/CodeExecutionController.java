package com.productivity.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Files;
import java.util.*;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = "http://localhost:5173")
public class CodeExecutionController {

    @PostMapping("/execute")
    public ResponseEntity<Map<String, String>> executeCode(@RequestBody Map<String, String> payload) throws IOException, InterruptedException{
        String language = payload.get("language");
        String code = payload.get("code");

        File tempFile;
        ProcessBuilder builder;
        String[] runCommand;

        switch (language.toLowerCase()) {
            case "python" -> {
                tempFile = File.createTempFile("Main", ".py");
                Files.writeString(tempFile.toPath(), code);
                runCommand = new String[]{"python", tempFile.getAbsolutePath()};
            }
            case "javascript" -> {
                tempFile = File.createTempFile("Main", ".js");
                Files.writeString(tempFile.toPath(), code);
                runCommand = new String[]{"node", tempFile.getAbsolutePath()};
            }
            case "java" -> {
                File dir = Files.createTempDirectory("java_code").toFile();
                tempFile = new File(dir, "Main.java");
                Files.writeString(tempFile.toPath(), code);
                new ProcessBuilder("javac", tempFile.getAbsolutePath()).directory(dir).start().waitFor();
                runCommand = new String[]{"java", "-cp", dir.getAbsolutePath(), "Main"};
            }
            case "cpp" -> {
                File dir = Files.createTempDirectory("cpp_code").toFile();
                tempFile = new File(dir, "main.cpp");
                Files.writeString(tempFile.toPath(), code);
                File exec = new File(dir, "main.out");
                new ProcessBuilder("g++", tempFile.getAbsolutePath(), "-o", exec.getAbsolutePath()).directory(dir).start().waitFor();
                runCommand = new String[]{exec.getAbsolutePath()};
            }
            default -> {
                return ResponseEntity.badRequest().body(Map.of("output", "Unsupported language: " + language));
            }
        }

        builder = new ProcessBuilder(runCommand);
        builder.redirectErrorStream(true);
        Process process = builder.start();
        String output = new String(process.getInputStream().readAllBytes());

        return ResponseEntity.ok(Map.of("output", output));
    }
}
