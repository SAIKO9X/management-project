package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa uma tag no sistema de gerenciamento.
 * Utilizada para categorizar projetos e issues, facilitando busca e organização.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_tag")
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  /**
   * Usuário proprietário da tag, responsável por sua criação.
   */
  @ManyToOne
  private User owner;
}