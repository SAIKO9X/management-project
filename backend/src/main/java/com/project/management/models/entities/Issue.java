package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.management.models.enums.IssuePriority;
import com.project.management.models.enums.IssueStatus;
import com.project.management.models.enums.IssueType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Issue associada a um projeto, representando tarefas ou problemas.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_issue")
public class Issue {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @JsonIgnore
  @ManyToOne
  @ToString.Exclude
  private Project project; // Projeto ao qual esta issue pertence.

  @ManyToOne
  private User assignee; // Usuário que será o responsável pela tarefa.

  @ManyToOne
  private User creator; // Usuário que criou a issue.

  @JsonIgnore
  @ToString.Exclude
  @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Comment> comments = new ArrayList<>();  // Comentários associados à issue, com remoção em cascata.

  @ManyToMany
  @JoinTable(name = "issue_tag", joinColumns = @JoinColumn(name = "issue_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
  private List<Tag> tags = new ArrayList<>(); // Tags associadas à issue.

  @ManyToOne
  @ToString.Exclude
  private Milestone milestone; // Marco/Sprint ao qual esta issue está vinculada.

  @JsonIgnore
  @ToString.Exclude
  @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Attachment> attachments = new ArrayList<>(); // Anexos associados à issue, com remoção em cascata.

  @NotBlank(message = "O título é obrigatório")
  private String title;

  private String description;

  @Enumerated(EnumType.STRING)
  @NotNull(message = "O status é obrigatório")
  private IssueStatus status;

  @NotNull(message = "O ID do projeto é obrigatório")
  private Long projectID;


  @Enumerated(EnumType.STRING)
  @NotNull(message = "A prioridade é obrigatória")
  private IssuePriority priority;

  @Enumerated(EnumType.STRING)
  @NotNull(message = "O tipo da issue é obrigatório")
  private IssueType type;

  @Column(name = "due_date")
  private LocalDateTime dueDate;

  @JsonIgnore
  private LocalDateTime createdAt;

  @JsonIgnore
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    // Inicializa automaticamente as datas de criação e atualização na persistência.
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    // Atualiza automaticamente a data de modificação antes da atualização.
    this.updatedAt = LocalDateTime.now();
  }
}