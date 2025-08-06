package com.project.management.controllers;

import com.project.management.models.dto.MilestoneDTO;
import com.project.management.models.entities.Milestone;
import com.project.management.models.entities.User;
import com.project.management.request.MilestoneRequest;
import com.project.management.response.MessageResponse;
import com.project.management.services.MilestoneService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsável pelos endpoints de gerenciamento de marcos (milestones).
 * Fornece operações para CRUD de milestones além do gerenciamento de issues associadas aos milestones com autenticação JWT.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/milestones")
public class MilestoneController {

  private final MilestoneService milestoneService;
  private final UserService userService;

  /**
   * Cria um novo milestone no sistema.
   *
   * @param milestoneRequest dados do milestone para criação
   * @param jwt              token JWT para autenticação do usuário
   * @return milestone criado com status HTTP 201
   * @throws Exception se o usuário não for encontrado ou dados inválidos
   */
  @PostMapping
  public ResponseEntity<Milestone> createMilestone(@RequestBody MilestoneRequest milestoneRequest, @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    Milestone milestone = new Milestone();
    milestone.setName(milestoneRequest.name());
    milestone.setDescription(milestoneRequest.description());
    milestone.setStartDate(milestoneRequest.startDate());
    milestone.setEndDate(milestoneRequest.endDate());
    milestone.setStatus(milestoneRequest.status());

    Milestone createdMilestone = milestoneService.createMilestone(milestone, milestoneRequest.projectId(), user.getId());
    return new ResponseEntity<>(createdMilestone, HttpStatus.CREATED);
  }

  /**
   * Busca um milestone específico pelo seu ID.
   * NOTA: Este endpoint retorna a entidade completa Milestone,
   * se precisar da porcentagem, use getMilestonesByProjectId e filtre no frontend.
   *
   * @param milestoneId identificador único do milestone
   * @return dados completos do milestone ou erro se não encontrado
   * @throws Exception se o milestone não existir
   */
  @GetMapping("/{milestoneId}")
  public ResponseEntity<Milestone> getMilestoneById(@PathVariable Long milestoneId) throws Exception {
    return ResponseEntity.ok(milestoneService.getMilestoneById(milestoneId));
  }

  /**
   * Recupera todos os milestones associados a um projeto específico, incluindo o progresso.
   *
   * @param projectId identificador do projeto
   * @return lista de MilestoneDTOs do projeto com status HTTP 200 (OK)
   * @throws Exception se o projeto não existir
   */
  @GetMapping("/project/{projectId}")
  public ResponseEntity<List<MilestoneDTO>> getMilestonesByProjectId(@PathVariable Long projectId) throws Exception {
    List<MilestoneDTO> milestones = milestoneService.getMilestonesByProjectId(projectId);
    return new ResponseEntity<>(milestones, HttpStatus.OK);
  }

  /**
   * Atualiza os dados de um milestone existente.
   *
   * @param milestoneId identificador do milestone a ser atualizado
   * @param milestone   dados atualizados do milestone
   * @param jwt         token JWT para autenticação do usuário
   * @return milestone atualizado ou erro se não encontrado/sem permissão
   * @throws Exception se o milestone não existir ou usuário não autorizado
   */
  @PutMapping("/{milestoneId}")
  public ResponseEntity<Milestone> updateMilestone(@PathVariable Long milestoneId, @RequestBody Milestone milestone, @RequestHeader("Authorization") String jwt) throws Exception {

    userService.findUserProfileByJwt(jwt); // Garante que o usuário está autenticado e existe

    return ResponseEntity.ok(milestoneService.updateMilestone(milestoneId, milestone));
  }

  /**
   * Remove um milestone do sistema.
   *
   * @param milestoneId identificador do milestone a ser removido
   * @param jwt         token JWT para autenticação do usuário
   * @return mensagem de confirmação da exclusão
   * @throws Exception se o milestone não existir ou usuário não autorizado
   */
  @DeleteMapping("/{milestoneId}")
  public ResponseEntity<MessageResponse> deleteMilestone(@PathVariable Long milestoneId, @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    milestoneService.deleteMilestone(milestoneId, user.getId());

    MessageResponse response = new MessageResponse();
    response.setMessage("Milestone deletado com sucesso");
    return ResponseEntity.ok(response);
  }

  /**
   * Associa uma issue específica a um milestone.
   *
   * @param milestoneId identificador do milestone
   * @param issueId     identificador da issue a ser associada
   * @return mensagem de confirmação da associação
   * @throws Exception se milestone ou issue não existirem
   */
  @PutMapping("/{milestoneId}/issues/{issueId}")
  public ResponseEntity<MessageResponse> addIssueToMilestone(@PathVariable Long milestoneId, @PathVariable Long issueId) throws Exception {

    milestoneService.addIssueToMilestone(milestoneId, issueId);

    MessageResponse response = new MessageResponse();
    response.setMessage("Issue adicionada ao milestone com sucesso");
    return ResponseEntity.ok(response);
  }

  /**
   * Remove a associação entre uma issue e um milestone.
   *
   * @param milestoneId identificador do milestone
   * @param issueId     identificador da issue a ser removida
   * @return mensagem de confirmação da remoção
   * @throws Exception se milestone ou issue não existirem ou não estiverem associados
   */
  @DeleteMapping("/{milestoneId}/issues/{issueId}")
  public ResponseEntity<MessageResponse> removeIssueFromMilestone(@PathVariable Long milestoneId, @PathVariable Long issueId) throws Exception {

    milestoneService.removeIssueFromMilestone(milestoneId, issueId);

    MessageResponse response = new MessageResponse();
    response.setMessage("Issue removida do milestone com sucesso");
    return ResponseEntity.ok(response);
  }
}