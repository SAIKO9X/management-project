package com.project.management.services.impl;

import com.project.management.models.entities.Attachment;
import com.project.management.models.entities.Issue;
import com.project.management.models.entities.User;
import com.project.management.repositories.AttachmentRepository;
import com.project.management.services.AttachmentService;
import com.project.management.services.IssueService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementação do serviço para gerenciamento de anexos associados a issues.
 */
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

  //Diretório base para armazenamento de arquivos, configurado via propriedade.
  @Value("${file.upload-dir:./uploads}")
  private String uploadDir;

  // Tamanho máximo permitido para arquivos (10MB).
  private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Número máximo de anexos por issue.
  private static final int MAX_ATTACHMENTS_PER_ISSUE = 5;

  private final AttachmentRepository attachmentRepository;
  private final IssueService issueService;
  private final UserService userService;

  /**
   * Faz upload de um anexo para uma issue, associando-o ao usuário e salvando no sistema de arquivos.
   *
   * @param file    Arquivo a ser enviado.
   * @param issueId ID da issue à qual o anexo será associado.
   * @param userId  ID do usuário que está enviando o anexo.
   * @return Anexo salvo.
   * @throws Exception Se o arquivo exceder o tamanho máximo, o limite de anexos for atingido ou ocorrer erro no armazenamento.
   */
  @Override
  public Attachment uploadAttachment(MultipartFile file, Long issueId, Long userId) throws Exception {
    Issue issue = issueService.getIssueById(issueId);
    User user = userService.findUserById(userId);

    // Verificar limites
    if (file.getSize() > MAX_FILE_SIZE) {
      throw new Exception("Arquivo muito grande. Tamanho máximo permitido: 10MB");
    }
    List<Attachment> attachments = attachmentRepository.findByIssueId(issueId);
    if (attachments.size() >= MAX_ATTACHMENTS_PER_ISSUE) {
      throw new Exception("Número máximo de anexos atingido para esta issue");
    }

    Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    Files.createDirectories(uploadPath);

    String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
    String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
    Path filePath = uploadPath.resolve(uniqueFileName);

    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    Attachment attachment = new Attachment();
    attachment.setFileName(originalFileName);
    attachment.setFileType(file.getContentType());
    attachment.setFilePath(uniqueFileName);
    attachment.setFileSize(file.getSize());
    attachment.setUploadDate(LocalDateTime.now());
    attachment.setIssue(issue);
    attachment.setUploader(user);

    Attachment savedAttachment = attachmentRepository.save(attachment);
    issue.getAttachments().add(savedAttachment);

    return savedAttachment;
  }

  /**
   * Recupera um anexo pelo seu ID.
   *
   * @param attachmentId ID do anexo a ser recuperado.
   * @return Anexo encontrado.
   * @throws Exception Se o anexo não for encontrado.
   */
  @Override
  public Attachment getAttachmentById(Long attachmentId) throws Exception {
    Optional<Attachment> attachment = attachmentRepository.findById(attachmentId);
    if (attachment.isPresent()) {
      return attachment.get();
    }
    throw new Exception("Nenhum anexo encontrado com id: " + attachmentId);
  }

  /**
   * Recupera todos os anexos associados a uma issue.
   *
   * @param issueId ID da issue.
   * @return Lista de anexos associados.
   * @throws Exception Se a issue não for encontrada.
   */
  @Override
  public List<Attachment> getAttachmentsByIssueId(Long issueId) throws Exception {
    issueService.getIssueById(issueId);
    return attachmentRepository.findByIssueId(issueId);
  }

  /**
   * Deleta um anexo do sistema, verificando permissões do usuário.
   *
   * @param attachmentId ID do anexo a ser deletado.
   * @param userId       ID do usuário solicitando a exclusão.
   * @throws Exception Se o usuário não tiver permissão ou o arquivo não puder ser deletado.
   */
  @Override
  public void deleteAttachment(Long attachmentId, Long userId) throws Exception {
    Attachment attachment = getAttachmentById(attachmentId);
    userService.findUserById(userId);

    if (!attachment.getUploader().getId().equals(userId) &&
      !attachment.getIssue().getProject().getOwner().getId().equals(userId)) {
      throw new Exception("Usuário não tem permissão para deletar este anexo");
    }

    Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    Path filePath = uploadPath.resolve(attachment.getFilePath());

    try {
      Files.deleteIfExists(filePath);
    } catch (IOException e) {
      throw new Exception("Não foi possível deletar o arquivo: " + e.getMessage());
    }

    attachmentRepository.deleteById(attachmentId);
  }

  /**
   * Faz download de um anexo, retornando seus bytes.
   *
   * @param attachmentId ID do anexo a ser baixado.
   * @return Array de bytes do arquivo.
   * @throws Exception Se o anexo ou arquivo não for encontrado.
   */
  @Override
  public byte[] downloadAttachment(Long attachmentId) throws Exception {
    Attachment attachment = getAttachmentById(attachmentId);
    Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    Path filePath = uploadPath.resolve(attachment.getFilePath());

    if (!Files.exists(filePath)) {
      throw new Exception("Arquivo não encontrado: " + attachment.getFileName());
    }

    return Files.readAllBytes(filePath);
  }
}