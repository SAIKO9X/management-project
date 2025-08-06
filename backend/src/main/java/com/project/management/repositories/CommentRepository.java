package com.project.management.repositories;

import com.project.management.models.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  List<Comment> findByIssueId(Long issueId);
}
