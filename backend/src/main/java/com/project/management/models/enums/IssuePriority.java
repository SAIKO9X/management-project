package com.project.management.models.enums;


import lombok.Getter;

/**
 * Enumeração que define as prioridades possíveis para uma issue.
 */
@Getter
public enum IssuePriority {
  BAIXA("Baixa"),
  MEDIA("Média"),
  ALTA("Alta");

  private final String displayName;

  IssuePriority(String displayName) {
    this.displayName = displayName;
  }
}