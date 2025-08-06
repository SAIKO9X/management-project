package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um usuário no sistema de gerenciamento.
 * Contém informações de perfil e associações com issues e papéis em projetos, permitindo autenticação e participação em atividades colaborativas.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_user")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String fullName;

  private String email;

  /**
   * Senha do usuário, restrita a escrita para serialização segura.
   */
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  private String profilePicture;

  /**
   * Issues atribuídas ao usuário como responsável.
   * Configuração em cascata para manter integridade referencial.
   */
  @JsonIgnore
  @OneToMany(mappedBy = "assignee", cascade = CascadeType.ALL)
  @ToString.Exclude
  private List<Issue> assignedIssues = new ArrayList<>();

  /**
   * Papéis do usuário em projetos, definindo permissões e responsabilidades.
   */
  @JsonIgnore
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  private List<ProjectRole> projectRoles = new ArrayList<>();

  private int projectSize;
}