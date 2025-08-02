package com.productivity.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.productivity.backend.entity.ChatMessage;
import com.productivity.backend.entity.ChatSession;
import com.productivity.backend.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired private ChatService chatService;

    @PostMapping("/save")
public ResponseEntity<?> saveChat(@RequestBody Map<String, Object> payload) {
    String email = (String) payload.get("email");
    String name = (String) payload.get("name");
    Long sessionId = payload.get("sessionId") != null ? Long.valueOf(payload.get("sessionId").toString()) : null;

    List<Map<String, String>> messagesData = (List<Map<String, String>>) payload.get("messages");
    List<ChatMessage> messages = messagesData.stream().map(data -> {
        ChatMessage msg = new ChatMessage();
        msg.setSender(data.get("sender"));
        msg.setText(data.get("text"));
        return msg;
    }).toList();

    ChatSession session = chatService.saveChat(email, name, sessionId, messages);
    return ResponseEntity.ok(Map.of("sessionId", session.getId()));
}


    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getSessions(@RequestParam String email) {
        return ResponseEntity.ok(chatService.getSessions(email));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@RequestParam Long sessionId) {
        return ResponseEntity.ok(chatService.getMessages(sessionId));
    }
    @PutMapping("/session-rename/{id}")
    public ResponseEntity<?> renameSession(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newName = request.get("name");
        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Chat name cannot be empty");
        }
        chatService.renameSession(id, newName.trim());
        return ResponseEntity.ok().build();
    }

    // Delete chat session
    @DeleteMapping("/session-delete/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        chatService.deleteSession(id);
        return ResponseEntity.ok().build();
    }
}

