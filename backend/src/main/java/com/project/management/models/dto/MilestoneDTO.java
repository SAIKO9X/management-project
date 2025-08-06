package com.project.management.models.dto;

import com.project.management.models.entities.Project;
import com.project.management.models.enums.MilestoneStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MilestoneDTO {
  private Long id;
  private String name;
  private String description;
  private LocalDate startDate;
  private LocalDate endDate;
  private MilestoneStatus status;
  private Project project;
  private double completionPercentage;
  private int totalIssues;
  private int completedIssues;
}