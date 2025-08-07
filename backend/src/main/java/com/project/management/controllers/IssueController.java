package com.project.management.controllers;

import com.project.management.models.dto.IssueDTO;
import com.project.management.models.entities.Issue;
import com.project.management.models.entities.Tag;
import com.project.management.models.entities.User;
import com.project.management.request.IssueRequest;
import com.project.management.response.MessageResponse;
import com.project.management.services.IssueService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gerenciamento de issues em projetos.
 * Fornece endpoints para operações CRUD de issues, Utiliza DTOs para transferência de dados e validação de autorização baseada em JWT para operações sensíveis.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/issues")
public class IssueController {

  private final IssueService issueService;
  private final UserService userService;

  /**
   * Recupera uma issue específica pelo seu ID e retorna como DTO.
   * Converte a entidade Issue para IssueDTO incluindo informações de tags,
   * projeto, usuários atribuídos e datas de criação/atualização.
   *
   * @param issueId ID da issue a ser recuperada
   * @return ResponseEntity contendo o DTO da issue com status HTTP 200 (OK)
   * @throws Exception se a issue não for encontrada
   */
  @GetMapping("/{issueId}")
  public ResponseEntity<IssueDTO> getIssueById(@PathVariable Long issueId) throws Exception {
    Issue issue = issueService.getIssueById(issueId);
    IssueDTO issueDTO = new IssueDTO();
    issueDTO.setId(issue.getId());
    issueDTO.setTitle(issue.getTitle());
    issueDTO.setDescription(issue.getDescription());
    issueDTO.setStatus(issue.getStatus());
    issueDTO.setProjectId(issue.getProjectID());
    issueDTO.setPriority(issue.getPriority());
    issueDTO.setType(issue.getType());
    issueDTO.setDueDate(issue.getDueDate());
    issueDTO.setTags(issue.getTags().stream().map(Tag::getName).toList());
    issueDTO.setProject(issue.getProject());
    issueDTO.setAssignee(issue.getAssignee());
    issueDTO.setCreator(issue.getCreator());
    issueDTO.setCreatedAt(issue.getCreatedAt());
    issueDTO.setUpdatedAt(issue.getUpdatedAt());
    return ResponseEntity.ok(issueDTO);
  }

  /**
   * Recupera todas as issues associadas a um projeto específico.
   * Retorna as entidades Issue completas sem conversão para DTO.
   *
   * @param projectId ID do projeto para recuperar as issues
   * @return ResponseEntity contendo lista de issues do projeto com status HTTP 200 (OK)
   * @throws Exception se houver erro na consulta
   */
  @GetMapping("/project/{projectId}")
  public ResponseEntity<List<Issue>> getIssueByProjectId(@PathVariable Long projectId) throws Exception {
    return ResponseEntity.ok(issueService.getIssueByProjectId(projectId));
  }

  /**
   * Cria uma nova issue para um projeto com validação de autenticação.
   * O usuário autenticado será definido como criador da issue.
   * Retorna a issue criada como DTO com informações essenciais.
   *
   * @param issueRequest dados da issue a ser criada
   * @param jwt          token JWT para autenticação do usuário
   * @return ResponseEntity contendo o DTO da issue criada com status HTTP 200 (OK)
   * @throws Exception se houver erro na autenticação do usuário ou validação dos dados
   */
  @PostMapping
  public ResponseEntity<IssueDTO> createIssue(@RequestBody IssueRequest issueRequest, @RequestHeader("Authorization") String jwt) throws Exception {
    User tokenUser = userService.findUserProfileByJwt(jwt);
    userService.findUserById(tokenUser.getId());

    Issue createdIssue = issueService.createIssue(issueRequest, tokenUser);
    IssueDTO issueDTO = new IssueDTO();
    issueDTO.setDescription(createdIssue.getDescription());
    issueDTO.setDueDate(createdIssue.getDueDate());
    issueDTO.setId(createdIssue.getId());
    issueDTO.setPriority(createdIssue.getPriority());
    issueDTO.setProject(createdIssue.getProject());
    issueDTO.setProjectId(createdIssue.getProjectID());
    issueDTO.setStatus(createdIssue.getStatus());
    issueDTO.setTitle(createdIssue.getTitle());
    issueDTO.setAssignee(createdIssue.getAssignee());
    issueDTO.setCreator(createdIssue.getCreator());
    return ResponseEntity.ok(issueDTO);
  }

  /**
   * Exclui uma issue com validação de autorização.
   * Apenas o proprietário do projeto pode excluir issues.
   *
   * @param issueId ID da issue a ser excluída
   * @param jwt     token JWT para autenticação do usuário
   * @return ResponseEntity contendo mensagem de sucesso com status HTTP 200 (OK)
   * @throws Exception se a issue não for encontrada, usuário não autenticado ou sem permissão
   */
  @DeleteMapping("/{issueId}")
  public ResponseEntity<MessageResponse> deleteIssue(@PathVariable Long issueId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    issueService.deleteIssue(issueId, user.getId());

    MessageResponse response = new MessageResponse();
    response.setMessage("Issue deletada");

    return ResponseEntity.ok(response);
  }

  /**
   * Atribui um usuário como responsável por uma issue específica.
   * Endpoint público que não requer autenticação JWT.
   *
   * @param issueId ID da issue
   * @param userId  ID do usuário a ser atribuído
   * @return ResponseEntity contendo a issue atualizada com status HTTP 200 (OK)
   * @throws Exception se a issue ou usuário não forem encontrados
   */
  @PutMapping("/{issueId}/assignee/{userId}")
  public ResponseEntity<Issue> addUserToIssue(@PathVariable Long issueId, @PathVariable Long userId) throws Exception {
    Issue issue = issueService.addUserToIssue(issueId, userId);
    return ResponseEntity.ok(issue);
  }

  /**
   * Atualiza o status de uma issue específica.
   * Endpoint público que não requer autenticação JWT.
   *
   * @param issueId ID da issue a ser atualizada
   * @param status  novo status da issue (deve corresponder aos valores do enum IssueStatus)
   * @return ResponseEntity contendo a issue atualizada com status HTTP 200 (OK)
   * @throws Exception se a issue não for encontrada ou status inválido
   */
  @PutMapping("/{issueId}/status/{status}")
  public ResponseEntity<Issue> updateStatus(@PathVariable Long issueId, @PathVariable String status) throws Exception {
    Issue issue = issueService.updateIssue(issueId, status);
    return ResponseEntity.ok(issue);
  }

  /**
   * Atualiza completamente uma issue com validação de autorização.
   * Permite que o proprietário do projeto ou usuário atribuído façam alterações.
   * Atualiza apenas os campos fornecidos na requisição (campos nulos são ignorados).
   *
   * @param issueId      ID da issue a ser atualizada
   * @param issueRequest entidade com os novos dados da issue
   * @param jwt          token JWT para autenticação do usuário
   * @return ResponseEntity contendo a issue atualizada com status HTTP 200 (OK)
   * @throws Exception se a issue não for encontrada, usuário não autenticado ou sem permissão
   */
  @PutMapping("/{issueId}")
  public ResponseEntity<Issue> updateIssue(
    @PathVariable Long issueId,
    @RequestBody IssueRequest issueRequest, // <-- Alterado de 'Issue' para 'IssueRequest'
    @RequestHeader("Authorization") String jwt
  ) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    Issue issue = issueService.updateIssueFull(issueId, issueRequest, user.getId());
    return ResponseEntity.ok(issue);
  }
}