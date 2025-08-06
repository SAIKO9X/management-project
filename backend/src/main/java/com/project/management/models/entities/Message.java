package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Mensagem enviada em um chat de projeto.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_message")
public class Message {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String content;

  private LocalDateTime createdAt;

  /**
   * Chat ao qual esta mensagem pertence.
   */
  @ManyToOne
  private Chat chat;

  /**
   * Usuário remetente da mensagem.
   */
  @ManyToOne
  private User sender;
}