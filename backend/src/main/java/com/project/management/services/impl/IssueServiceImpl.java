package com.project.management.services.impl;

import com.project.management.models.entities.*;
import com.project.management.models.enums.IssuePriority;
import com.project.management.models.enums.IssueStatus;
import com.project.management.models.enums.IssueType;
import com.project.management.repositories.IssueRepository;
import com.project.management.repositories.MilestoneRepository;
import com.project.management.repositories.TagRepository;
import com.project.management.request.IssueRequest;
import com.project.management.services.IssueService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementação do serviço para gerenciamento de issues em projetos.
 * Fornece operações completas para criação, atualização, exclusão e gerenciamento de issues,
 * incluindo associação com usuários, tags, milestones e validação de permissões.
 */
@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {

  private final IssueRepository issueRepository;
  private final ProjectService projectService;
  private final UserService userService;
  private final TagRepository tagRepository;
  private final MilestoneRepository milestoneRepository;


  /**
   * Recupera uma issue pelo seu ID.
   *
   * @param issueId ID da issue a ser recuperada
   * @return entidade da issue encontrada
   * @throws Exception se a issue não for encontrada
   */
  @Override
  public Issue getIssueById(Long issueId) throws Exception {
    Optional<Issue> issue = issueRepository.findById(issueId);
    if (issue.isPresent()) {
      return issue.get();
    }
    throw new Exception("Nenhum problema encontrado com issueId: " + issueId);
  }

  /**
   * Recupera todas as issues associadas a um projeto específico.
   *
   * @param projectId ID do projeto
   * @return lista de issues do projeto especificado
   * @throws Exception se houver erro na consulta
   */
  @Override
  public List<Issue> getIssueByProjectId(Long projectId) throws Exception {
    return issueRepository.findByProjectId(projectId);
  }

  /**
   * Cria uma nova issue com base nos dados fornecidos na requisição.
   * Define valores padrão para status, prioridade e tipo se não especificados.
   * Valida se o milestone pertence ao mesmo projeto da issue.
   * Valida se a data de vencimento não está no passado.
   *
   * @param issueRequest dados da issue a ser criada
   * @param user         usuário que está criando a issue (será definido como criador)
   * @return entidade da issue criada e salva
   * @throws Exception se o projeto não for encontrado ou o milestone pertencer a outro projeto
   */
  @Override
  public Issue createIssue(IssueRequest issueRequest, User user) throws Exception {
    Project project = projectService.getProjectById(issueRequest.projectId());

    if (issueRequest.dueDate() != null && issueRequest.dueDate().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("A data de vencimento não pode ser no passado.");
    }

    Issue issue = new Issue();
    issue.setTitle(issueRequest.title());
    issue.setDescription(issueRequest.description());
    issue.setStatus(issueRequest.status() != null ? IssueStatus.valueOf(issueRequest.status()) : IssueStatus.A_FAZER);
    issue.setProjectID(issueRequest.projectId());
    issue.setPriority(issueRequest.priority() != null ? IssuePriority.valueOf(issueRequest.priority()) : IssuePriority.BAIXA);
    issue.setType(issueRequest.type() != null ? IssueType.valueOf(issueRequest.type()) : IssueType.TASK);
    issue.setDueDate(issueRequest.dueDate());
    issue.setProject(project);
    issue.setCreator(user);

    if (issueRequest.milestoneId() != null) {
      Milestone milestone = milestoneRepository.findById(issueRequest.milestoneId())
        .orElseThrow(() -> new Exception("Milestone não encontrado"));
      if (!milestone.getProject().getId().equals(project.getId())) {
        throw new Exception("Milestone pertence a um projeto diferente.");
      }
      issue.setMilestone(milestone);
    }

    return issueRepository.save(issue);
  }

  /**
   * Atualiza o status de uma issue específica.
   *
   * @param issueId ID da issue a ser atualizada
   * @param status  novo status da issue
   * @return entidade da issue atualizada
   * @throws Exception se a issue não for encontrada
   */
  @Override
  public Issue updateIssue(Long issueId, String status) throws Exception {
    Issue issue = getIssueById(issueId);
    issue.setStatus(IssueStatus.valueOf(status));
    return issueRepository.save(issue);
  }

  /**
   * Exclui uma issue com validação de autorização.
   * Apenas o proprietário do projeto pode excluir issues.
   *
   * @param issueId ID da issue a ser excluída
   * @param userId  ID do usuário solicitando a exclusão
   * @throws Exception se a issue não for encontrada ou o usuário não tiver permissão
   */
  @Override
  public void deleteIssue(Long issueId, Long userId) throws Exception {
    User user = userService.findUserById(userId);
    Issue issue = getIssueById(issueId);

    if (!hasManagementPermission(issue, user)) {
      throw new Exception("Você não tem permissão para deletar esta issue.");
    }

    issueRepository.deleteById(issueId);
  }

  /**
   * Atribui um usuário como responsável por uma issue.
   *
   * @param issueId ID da issue
   * @param userId  ID do usuário a ser atribuído
   * @return entidade da issue atualizada com o usuário atribuído
   * @throws Exception se a issue ou usuário não forem encontrados
   */
  @Override
  public Issue addUserToIssue(Long issueId, Long userId) throws Exception {
    User user = userService.findUserById(userId);
    Issue issue = getIssueById(issueId);
    issue.setAssignee(user);
    return issueRepository.save(issue);
  }

  /**
   * Atualiza completamente uma issue com validação de autorização.
   * Permite que o proprietário do projeto ou o usuário atribuído à issue façam alterações.
   * Atualiza apenas os campos fornecidos na requisição (campos nulos são ignorados).
   * Valida se a data de vencimento não está no passado.
   *
   * @param issueId      ID da issue a ser atualizada
   * @param issueRequest entidade com os novos dados da issue
   * @param userId       ID do usuário solicitando a atualização
   * @return entidade da issue atualizada
   * @throws Exception se a issue não for encontrada ou o usuário não tiver permissão
   */
  @Override
  public Issue updateIssueFull(Long issueId, IssueRequest issueRequest, Long userId) throws Exception {
    Issue issue = getIssueById(issueId);
    User user = userService.findUserById(userId);

    boolean canUpdate = hasManagementPermission(issue, user) ||
      (issue.getAssignee() != null && issue.getAssignee().getId().equals(userId));

    if (!canUpdate) {
      throw new Exception("Você não tem permissão para editar esta issue.");
    }

    if (issueRequest.title() != null) {
      issue.setTitle(issueRequest.title());
    }
    if (issueRequest.description() != null) {
      issue.setDescription(issueRequest.description());
    }
    if (issueRequest.status() != null) {
      issue.setStatus(IssueStatus.valueOf(issueRequest.status()));
    }
    if (issueRequest.priority() != null) {
      issue.setPriority(IssuePriority.valueOf(issueRequest.priority()));
    }
    if (issueRequest.type() != null) {
      issue.setType(IssueType.valueOf(issueRequest.type()));
    }
    if (issueRequest.dueDate() != null) {
      issue.setDueDate(issueRequest.dueDate());
    }

    if (issueRequest.milestoneId() != null) {
      Milestone milestone = milestoneRepository.findById(issueRequest.milestoneId())
        .orElseThrow(() -> new Exception("Milestone não encontrado"));
      if (!milestone.getProject().getId().equals(issue.getProject().getId())) {
        throw new Exception("Milestone pertence a um projeto diferente.");
      }
      issue.setMilestone(milestone);
    } else {
      issue.setMilestone(null);
    }

    return issueRepository.save(issue);
  }

  /**
   * Verifica se o usuário tem permissão de gerenciamento (OWNER ou ADMINISTRATOR) sobre a issue.
   *
   * @param issue A issue a ser verificada.
   * @param user  O usuário a ser verificado.
   * @return true se o usuário tiver permissão, false caso contrário.
   */
  private boolean hasManagementPermission(Issue issue, User user) {
    Project project = issue.getProject();
    return project.getRoles().stream()
      .anyMatch(role -> role.getUser().getId().equals(user.getId()) &&
        (role.getRole() == ProjectRole.Role.OWNER || role.getRole() == ProjectRole.Role.ADMINISTRATOR));
  }
}