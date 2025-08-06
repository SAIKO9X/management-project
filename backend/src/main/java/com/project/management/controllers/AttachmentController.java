package com.project.management.controllers;

import com.project.management.models.entities.Attachment;
import com.project.management.models.entities.User;
import com.project.management.response.MessageResponse;
import com.project.management.services.AttachmentService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attachments")
public class AttachmentController {

  private final AttachmentService attachmentService;
  private final UserService userService;

  @PostMapping("/upload")
  public ResponseEntity<Attachment> uploadAttachment(@RequestParam("file") MultipartFile file, @RequestParam("issueId") Long issueId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    Attachment attachment = attachmentService.uploadAttachment(file, issueId, user.getId());
    return new ResponseEntity<>(attachment, HttpStatus.CREATED);
  }

  @GetMapping("/{attachmentId}")
  public ResponseEntity<Attachment> getAttachmentById(@PathVariable Long attachmentId) throws Exception {
    return ResponseEntity.ok(attachmentService.getAttachmentById(attachmentId));
  }

  @GetMapping("/issue/{issueId}")
  public ResponseEntity<List<Attachment>> getAttachmentsByIssueId(@PathVariable Long issueId) throws Exception {
    return ResponseEntity.ok(attachmentService.getAttachmentsByIssueId(issueId));
  }

  @DeleteMapping("/{attachmentId}")
  public ResponseEntity<MessageResponse> deleteAttachment(@PathVariable Long attachmentId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    attachmentService.deleteAttachment(attachmentId, user.getId());

    MessageResponse response = new MessageResponse();
    response.setMessage("Anexo deletado com sucesso");
    return ResponseEntity.ok(response);
  }

  @GetMapping("/download/{attachmentId}")
  public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) throws Exception {
    Attachment attachment = attachmentService.getAttachmentById(attachmentId);
    byte[] fileContent = attachmentService.downloadAttachment(attachmentId);

    ByteArrayResource resource = new ByteArrayResource(fileContent);

    return ResponseEntity.ok().contentType(MediaType.parseMediaType(attachment.getFileType())).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"").body(resource);
  }
}