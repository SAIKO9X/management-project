package com.project.management.request;

import java.time.LocalDateTime;

public record IssueRequest(
  String title,
  String description,
  String status,
  Long projectId,
  String priority,
  String type,
  LocalDateTime dueDate,
  Long milestoneId
) {
}