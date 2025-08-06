package com.project.management.models.enums;

import lombok.Getter;

/**
 * Enumeração que define os status possíveis para uma issue.
 */
@Getter
public enum IssueStatus {
  A_FAZER("A Fazer"),
  EM_PROGRESSO("Em Progresso"),
  CONCLUIDO("Concluído");

  private final String displayName;

  IssueStatus(String displayName) {
    this.displayName = displayName;
  }
}