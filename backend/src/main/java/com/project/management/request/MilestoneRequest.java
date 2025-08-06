package com.project.management.request;

import com.project.management.models.enums.MilestoneStatus;

import java.time.LocalDate;

public record MilestoneRequest(
  String name,
  String description,
  LocalDate startDate,
  LocalDate endDate,
  MilestoneStatus status,
  Long projectId
) {
}