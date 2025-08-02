package com.productivity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.productivity.backend.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionId(Long sessionId);
}
