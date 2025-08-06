package com.project.management.models.dto;

import com.project.management.models.entities.Project;
import com.project.management.models.entities.User;
import com.project.management.models.enums.IssuePriority;
import com.project.management.models.enums.IssueStatus;
import com.project.management.models.enums.IssueType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssueDTO {
  private Long id;
  private String title;
  private String description;
  private IssueStatus status;
  private Long projectId;
  private IssuePriority priority;
  private IssueType type;
  private LocalDateTime dueDate;
  private List<String> tags = new ArrayList<>();
  private Project project;
  private User assignee;
  private User creator;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}