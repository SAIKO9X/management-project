package com.project.management.repositories;

import com.project.management.models.entities.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

  List<Issue> findByProjectId(Long id);

  List<Issue> findByMilestoneId(Long id);
}
