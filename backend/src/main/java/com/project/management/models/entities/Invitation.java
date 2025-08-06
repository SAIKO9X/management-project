package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * Convite para participação em um projeto.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_invitation")
public class Invitation {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String token;

  private String email;

  private Long projectId;
}