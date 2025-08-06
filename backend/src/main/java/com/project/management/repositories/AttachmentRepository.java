package com.project.management.repositories;

import com.project.management.models.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
  List<Attachment> findByIssueId(Long issueId);
}