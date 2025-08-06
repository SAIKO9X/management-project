package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * Representa um arquivo anexado a uma issue do sistema.
 * Armazena metadados do arquivo e referências para a issue e usuário responsável pelo upload.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tb_attachment")
public class Attachment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  @ToString.Exclude
  private Issue issue; // Issue à qual este anexo pertence.

  @ManyToOne
  @ToString.Exclude
  private User uploader; // Usuário responsável pelo upload do arquivo.

  private String fileName;

  private String fileType;

  private String filePath;

  private Long fileSize;

  private LocalDateTime uploadDate;
}