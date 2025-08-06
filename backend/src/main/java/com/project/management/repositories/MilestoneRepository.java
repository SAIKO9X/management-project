package com.project.management.repositories;

import com.project.management.models.entities.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
  List<Milestone> findByProjectId(Long projectId);
}