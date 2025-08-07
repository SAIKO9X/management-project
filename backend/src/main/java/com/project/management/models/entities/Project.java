package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um projeto no sistema de gerenciamento.
 * Centraliza a organização de issues, chats, equipes e papéis,
 * servindo como contexto principal para colaboração entre usuários.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString(exclude = {"chat", "issues", "team", "tags", "roles"})
@Table(name = "tb_project")
public class Project {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  private String description;

  private String status;

  private String icon;

  @ManyToOne
  private Category category;

  /**
   * Tags para categorização e busca do projeto.
   * Carregamento eager para facilitar filtragem e exibição.
   */
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "project_tag",
    joinColumns = @JoinColumn(name = "project_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id")
  )
  private List<Tag> tags = new ArrayList<>();

  /**
   * Canal de comunicação dedicado ao projeto.
   * Removido automaticamente quando o projeto é excluído.
   */
  @JsonIgnore
  @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  private Chat chat;

  @ManyToOne
  private User owner;

  /**
   * Issues/tarefas pertencentes ao projeto.
   * Configuração em cascata para manter integridade referencial.
   */
  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Issue> issues = new ArrayList<>();

  /**
   * Membros da equipe com acesso ao projeto.
   */
  @ManyToMany
  private List<User> team = new ArrayList<>();

  /**
   * Definição de papéis específicos dos usuários no contexto do projeto.
   */
  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference(value = "project-role")
  private List<ProjectRole> roles = new ArrayList<>();
}