package com.project.management.services;

import com.project.management.models.dto.MilestoneDTO;
import com.project.management.models.entities.Milestone;

import java.util.List;

public interface MilestoneService {
  Milestone createMilestone(Milestone milestone, Long projectId, Long userId) throws Exception;

  Milestone getMilestoneById(Long milestoneId) throws Exception;

  List<MilestoneDTO> getMilestonesByProjectId(Long projectId) throws Exception;

  Milestone updateMilestone(Long milestoneId, Milestone milestone) throws Exception;

  void deleteMilestone(Long milestoneId, Long userId) throws Exception;

  void addIssueToMilestone(Long milestoneId, Long issueId) throws Exception;

  void removeIssueFromMilestone(Long milestoneId, Long issueId) throws Exception;
}