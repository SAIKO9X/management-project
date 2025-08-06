package com.project.management.services;

import com.project.management.models.entities.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
  Attachment uploadAttachment(MultipartFile file, Long issueId, Long userId) throws Exception;

  Attachment getAttachmentById(Long attachmentId) throws Exception;

  List<Attachment> getAttachmentsByIssueId(Long issueId) throws Exception;

  void deleteAttachment(Long attachmentId, Long userId) throws Exception;

  byte[] downloadAttachment(Long attachmentId) throws Exception;
}