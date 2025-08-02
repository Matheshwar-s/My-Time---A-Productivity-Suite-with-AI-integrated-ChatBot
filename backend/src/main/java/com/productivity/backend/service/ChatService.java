package com.productivity.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.productivity.backend.entity.ChatMessage;
import com.productivity.backend.entity.ChatSession;
import com.productivity.backend.repository.ChatMessageRepository;
import com.productivity.backend.repository.ChatSessionRepository;

@Service
public class ChatService {
    @Autowired private ChatSessionRepository sessionRepo;
    @Autowired private ChatMessageRepository messageRepo;

    public ChatSession saveChat(String email, String name, Long sessionId, List<ChatMessage> messages) {
    ChatSession session;

    if (sessionId != null) {
        // ✅ If session not found, throw error instead of making a new one
        session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
    } else {
        session = new ChatSession();
        session.setEmail(email);
        session.setChatName("Untitled"); // Only for new session
    }

    for (ChatMessage msg : messages) {
        msg.setSession(session);
    }

    session.getMessages().addAll(messages);
    return sessionRepo.save(session);
}



    public List<ChatSession> getSessions(String email) {
        return sessionRepo.findByEmail(email);
    }

    public List<ChatMessage> getMessages(Long sessionId) {
        return messageRepo.findBySessionId(sessionId);
    }
    public void renameSession(Long sessionId, String newName) {
    ChatSession session = sessionRepo.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Chat session not found"));
    session.setChatName(newName);
    sessionRepo.save(session);
}

public void deleteSession(Long sessionId) {
    if (!sessionRepo.existsById(sessionId)) {
        throw new RuntimeException("Chat session not found");
    }
    sessionRepo.deleteById(sessionId);
}

}
