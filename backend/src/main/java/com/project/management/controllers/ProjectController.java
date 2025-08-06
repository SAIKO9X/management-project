package com.project.management.controllers;

import com.project.management.models.entities.Chat;
import com.project.management.models.entities.Invitation;
import com.project.management.models.entities.Project;
import com.project.management.models.entities.User;
import com.project.management.request.InviteRequest;
import com.project.management.response.MessageResponse;
import com.project.management.services.InvitationService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsável pelos endpoints de gerenciamento de projetos.
 * Fornece operações para CRUD além do gerenciamento de convites, permissões e chat associado aos projetos com validação de autenticação e autorização baseada em roles.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

  private final ProjectService projectService;
  private final UserService userService;
  private final InvitationService invitationService;

  /**
   * Recupera a lista de projetos do usuário com filtros opcionais.
   *
   * @param category filtro opcional por categoria de projeto
   * @param tag      filtro opcional por tag de projeto
   * @param jwt      token JWT para autenticação do usuário
   * @return lista de projetos filtrados do time do usuário
   * @throws Exception se o usuário não for encontrado ou erro de autenticação
   */
  @GetMapping
  public ResponseEntity<List<Project>> getProjects(
    @RequestParam(required = false) String category,
    @RequestParam(required = false) String tag,
    @RequestHeader("Authorization") String jwt
  ) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    List<Project> projects = projectService.getProjectByTeam(user, category, tag);
    return new ResponseEntity<>(projects, HttpStatus.OK);
  }

  /**
   * Busca um projeto específico pelo seu ID.
   *
   * @param projectId identificador único do projeto
   * @param jwt       token JWT para autenticação do usuário
   * @return dados completos do projeto ou erro se não encontrado/sem acesso
   * @throws Exception se o projeto não existir ou usuário sem permissão
   */
  @GetMapping("/{projectId}")
  public ResponseEntity<Project> getProjectById(@PathVariable Long projectId, @RequestHeader("Authorization") String jwt) throws Exception {

    userService.findUserProfileByJwt(jwt);

    Project project = projectService.getProjectById(projectId);
    return new ResponseEntity<>(project, HttpStatus.OK);
  }

  /**
   * Realiza busca de projetos por palavra-chave.
   *
   * @param keyword termo de busca para filtrar projetos por nome ou descrição
   * @param jwt     token JWT para autenticação do usuário
   * @return lista de projetos que correspondem à busca
   * @throws Exception se ocorrer erro na busca ou autenticação
   */
  @GetMapping("/search")
  public ResponseEntity<List<Project>> searchProjects(
    @RequestParam(required = false) String keyword,
    @RequestHeader("Authorization") String jwt
  ) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    List<Project> projects = projectService.searchProjects(keyword, user);
    return new ResponseEntity<>(projects, HttpStatus.OK);
  }

  /**
   * Cria um novo projeto no sistema.
   *
   * @param project dados do projeto a ser criado (validados)
   * @param jwt     token JWT para autenticação do usuário
   * @return projeto criado com o usuário como owner
   * @throws Exception se dados inválidos ou erro na criação
   */
  @PostMapping
  public ResponseEntity<Project> createProject(@Valid @RequestBody Project project, @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    Project createdProject = projectService.createProject(project, user);
    return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
  }

  /**
   * Atualiza os dados de um projeto existente.
   *
   * @param projectId identificador do projeto a ser atualizado
   * @param project   dados atualizados do projeto (validados)
   * @param jwt       token JWT para autenticação do usuário
   * @return projeto atualizado ou erro se não autorizado
   * @throws Exception se projeto não existir ou usuário sem permissão
   */
  @PatchMapping("/{projectId}")
  public ResponseEntity<Project> updateProject(
    @PathVariable Long projectId,
    @Valid @RequestBody Project project,
    @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    Project updatedProject = projectService.updateProject(project, projectId, user.getId());
    return new ResponseEntity<>(updatedProject, HttpStatus.OK);
  }

  /**
   * Remove um projeto do sistema (apenas owner pode executar).
   *
   * @param projectId identificador do projeto a ser removido
   * @param jwt       token JWT para autenticação do usuário
   * @return mensagem de confirmação da exclusão
   * @throws Exception se não for owner ou projeto não existir
   */
  @DeleteMapping("/{projectId}")
  public ResponseEntity<MessageResponse> deleteProject(@PathVariable Long projectId, @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);
    Project project = projectService.getProjectById(projectId);

    if (!projectService.isOwner(user, project)) {
      throw new Exception("Apenas o Owner pode deletar o projeto.");
    }

    projectService.deleteProject(projectId, user.getId());
    MessageResponse response = new MessageResponse("Projeto deletado com sucesso");
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  /**
   * Recupera o chat associado a um projeto específico.
   *
   * @param projectId identificador do projeto
   * @param jwt       token JWT para autenticação do usuário
   * @return dados do chat do projeto ou erro se não tiver acesso
   * @throws Exception se projeto não existir ou usuário sem permissão
   */
  @GetMapping("/{projectId}/chat")
  public ResponseEntity<Chat> getChatByProjectId(@PathVariable Long projectId, @RequestHeader("Authorization") String jwt) throws Exception {

    userService.findUserProfileByJwt(jwt);

    Chat chat = projectService.getChatByProjectId(projectId);
    return new ResponseEntity<>(chat, HttpStatus.OK);
  }

  /**
   * Envia convite para participar de um projeto (apenas owner pode convidar).
   *
   * @param request dados do convite incluindo email e ID do projeto
   * @param jwt     token JWT para autenticação do usuário
   * @return confirmação de envio do convite
   * @throws Exception se não for owner ou dados inválidos
   */
  @PostMapping("/invite")
  public ResponseEntity<MessageResponse> inviteToProject(@RequestBody InviteRequest request, @RequestHeader("Authorization") String jwt) throws Exception {

    User requester = userService.findUserProfileByJwt(jwt);
    Project project = projectService.getProjectById(request.projectId());

    if (!projectService.isOwner(requester, project)) {
      throw new Exception("Apenas o Owner pode convidar usuários.");
    }

    invitationService.sendInvitation(request.email(), request.projectId());
    MessageResponse message = new MessageResponse("Convite de usuário enviado");
    return new ResponseEntity<>(message, HttpStatus.OK);
  }

  /**
   * Aceita um convite para participar de um projeto usando token de convite.
   *
   * @param token token de convite recebido por email
   * @param jwt   token JWT para autenticação do usuário
   * @return dados do convite aceito
   * @throws Exception se token inválido/expirado ou erro no processamento
   */
  @GetMapping("/accept_invitation")
  public ResponseEntity<Invitation> acceptInvitation(@RequestParam String token, @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);
    Invitation invitation = invitationService.acceptInvitation(token, user.getId());

    projectService.addUserToProjectByInvitation(invitation.getProjectId(), user.getId(), "MEMBER");
    invitationService.deleteToken(token);
    return new ResponseEntity<>(invitation, HttpStatus.ACCEPTED);
  }

  /**
   * Atribui um role específico a um usuário em um projeto.
   *
   * @param projectId identificador do projeto
   * @param userId    identificador do usuário a receber o role
   * @param role      tipo de role a ser atribuído (OWNER, ADMIN, MEMBER)
   * @param jwt       token JWT para autenticação do usuário
   * @return confirmação da atribuição do role
   * @throws Exception se não tiver permissão ou dados inválidos
   */
  @PostMapping("/{projectId}/roles")
  public ResponseEntity<MessageResponse> assignRoleToUser(
    @PathVariable Long projectId,
    @RequestParam Long userId,
    @RequestParam String role,
    @RequestHeader("Authorization") String jwt
  ) throws Exception {

    projectService.addUserToProject(projectId, userId, role, jwt);
    MessageResponse response = new MessageResponse("Cargo atribuído com sucesso");
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}