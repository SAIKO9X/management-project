package com.project.management.models.enums;

import lombok.Getter;

/**
 * Enumeração que define os status possíveis para um marco.
 */
@Getter
public enum MilestoneStatus {
  PLANEJADO("Planejado"),
  EM_ANDAMENTO("Em Andamento"),
  CONCLUIDO("Concluído");

  private final String displayName;

  MilestoneStatus(String displayName) {
    this.displayName = displayName;
  }
}