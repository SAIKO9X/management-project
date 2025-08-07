package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.management.models.enums.MilestoneStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Marco que define etapas ou entregas de um projeto, organizando issues e prazos.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_milestone")
public class Milestone {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @NotBlank(message = "O nome é obrigatório")
  private String name;

  private String description;

  @NotNull(message = "A data de início é obrigatória")
  private LocalDate startDate;

  @NotNull(message = "A data de término é obrigatória")
  private LocalDate endDate;

  /**
   * Status do marco, armazenado como string.
   */
  @Enumerated(EnumType.STRING)
  @NotNull(message = "O status é obrigatório")
  private MilestoneStatus status;

  /**
   * Projeto ao qual este marco pertence.
   */
  @JsonIgnore 
  @ManyToOne
  @NotNull(message = "O projeto é obrigatório")
  private Project project;

  /**
   * Todas as tarefas que estão associadas a este marco.
   */
  @JsonIgnore
  @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL)
  @ToString.Exclude
  private List<Issue> issues = new ArrayList<>();

  /**
   * Valida se a data de início é anterior à data de término na persistência ou atualização.
   */
  @PrePersist
  @PreUpdate
  private void validateDates() {
    if (startDate.isAfter(endDate)) {
      throw new IllegalArgumentException("A data de início deve ser anterior à data de término");
    }
  }
}