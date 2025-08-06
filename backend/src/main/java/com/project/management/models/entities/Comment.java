package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * Comentário associado a uma issue, permitindo discussão e acompanhamento.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_comment")
public class Comment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String content;

  private LocalDateTime createdAt;

  @ManyToOne
  @ToString.Exclude
  private User user; //Autor do comentário.

  @ManyToOne
  @ToString.Exclude
  private Issue issue; // Issue à qual este comentário pertence.


  @PrePersist
  protected void onCreate() {
    // Inicializa automaticamente a data de criação na persistência.
    this.createdAt = LocalDateTime.now();
  }
}