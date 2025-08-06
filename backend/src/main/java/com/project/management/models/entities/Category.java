package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * Categoria para organização e classificação de projetos.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_category")
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  /**
   * Usuário proprietário desta categoria.
   */
  @ManyToOne
  private User owner;
}