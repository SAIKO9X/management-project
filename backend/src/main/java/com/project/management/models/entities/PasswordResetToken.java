package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Token utilizado para redefinição de senha de um usuário.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_reset_token")
public class PasswordResetToken {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String token;

  /**
   * Usuário que deve ser enviado o token para resetar a senha.
   */
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  private LocalDateTime expiryDate;

  /**
   * Inicializa o token e o usuário, definindo expiração de 1 hora.
   */
  public PasswordResetToken(String token, User user) {
    this.token = token;
    this.user = user;
    this.expiryDate = LocalDateTime.now().plusHours(1);
  }

  /**
   * Verifica se o token está expirado.
   */
  public boolean isExpired() {
    return LocalDateTime.now().isAfter(expiryDate);
  }
}