package com.project.management.models.enums;

import lombok.Getter;

/**
 * Enumeração que define os tipos possíveis para uma issue, com nome e descrição.
 */
@Getter
public enum IssueType {
  BUG("Bug", "Um erro ou problema no sistema"),
  FEATURE("Feature", "Nova funcionalidade"),
  TASK("Tarefa", "Tarefa de desenvolvimento"),
  IMPROVEMENT("Melhoria", "Aprimoramento de funcionalidade existente"),
  RESEARCH("Pesquisa", "Investigação técnica"),
  SPIKE("Spike", "Investigação de solução técnica");

  private final String displayName;
  private final String description;

  IssueType(String displayName, String description) {
    this.displayName = displayName;
    this.description = description;
  }
}