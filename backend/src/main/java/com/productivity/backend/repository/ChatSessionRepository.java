package com.productivity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.productivity.backend.entity.ChatSession;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByEmail(String email);
}

