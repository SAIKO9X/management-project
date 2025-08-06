package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa o papel de um usuário em um projeto.
 * Define permissões e responsabilidades específicas dentro do contexto do projeto.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_project_role")
public class ProjectRole {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  /**
   * Usuário associado ao papel no projeto.
   */
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  /**
   * Projeto ao qual o papel está vinculado.
   */
  @ManyToOne
  @JsonBackReference(value = "project-role")
  private Project project;

  /**
   * Papel do usuário no projeto, armazenado como string.
   */
  @Enumerated(EnumType.STRING)
  private Role role;

  /**
   * Enum para representar os possiveis cargos de um user dentro do projeto.
   */
  @Getter
  public enum Role {
    OWNER("Owner"),
    ADMINISTRATOR("Administrator"),
    MEMBER("Member");

    private final String displayName;

    Role(String displayName) {
      this.displayName = displayName;
    }
  }
}