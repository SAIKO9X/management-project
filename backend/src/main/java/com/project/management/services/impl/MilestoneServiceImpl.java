package com.project.management.services.impl;

import com.project.management.models.dto.MilestoneDTO;
import com.project.management.models.entities.Issue;
import com.project.management.models.entities.Milestone;
import com.project.management.models.entities.Project;
import com.project.management.models.entities.User;
import com.project.management.models.enums.IssueStatus;
import com.project.management.repositories.IssueRepository;
import com.project.management.repositories.MilestoneRepository;
import com.project.management.services.MilestoneService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementação do serviço para gerenciamento de marcos em projetos.
 * Gerencia criação, atualização, exclusão e associação de marcos com issues.
 */
@Service
@RequiredArgsConstructor
public class MilestoneServiceImpl implements MilestoneService {

  private final MilestoneRepository milestoneRepository;
  private final ProjectService projectService;
  private final IssueRepository issueRepository;
  private final UserService userService;

  /**
   * Cria um novo marco para um projeto, verificando permissões.
   * Valida se as datas de início e término não estão no passado.
   *
   * @param milestone Marco a ser criado
   * @param projectId ID do projeto associado
   * @param userId    ID do usuário solicitante
   * @return Entidade do marco criado
   * @throws Exception Se o usuário não tiver permissão ou o projeto não for encontrado
   */
  @Override
  public Milestone createMilestone(Milestone milestone, Long projectId, Long userId) throws Exception {
    Project project = projectService.getProjectById(projectId);
    userService.findUserById(userId);

    if (!project.getOwner().getId().equals(userId)) {
      throw new Exception("Usuário não tem permissão para criar milestone neste projeto");
    }
    if (milestone.getStartDate() != null && milestone.getStartDate().isBefore(LocalDate.now())) {
      throw new IllegalArgumentException("A data de início da milestone não pode ser no passado.");
    }
    if (milestone.getEndDate() != null && milestone.getEndDate().isBefore(LocalDate.now())) {
      throw new IllegalArgumentException("A data de término da milestone não pode ser no passado.");
    }

    milestone.setProject(project);
    return milestoneRepository.save(milestone);
  }

  /**
   * Recupera um marco pelo seu ID.
   *
   * @param milestoneId ID do marco
   * @return Entidade do marco encontrado
   * @throws Exception Se o marco não for encontrado.
   */
  @Override
  public Milestone getMilestoneById(Long milestoneId) throws Exception {
    Optional<Milestone> milestone = milestoneRepository.findById(milestoneId);
    if (milestone.isPresent()) {
      return milestone.get();
    }
    throw new Exception("Nenhum milestone encontrado com id: " + milestoneId);
  }

  /**
   * Recupera todos os marcos de um projeto e calcula o progresso de cada um.
   *
   * @param projectId ID do projeto
   * @return Lista de MilestoneDTOs com o progresso calculado
   * @throws Exception Se o projeto não for encontrado
   */
  @Override
  public List<MilestoneDTO> getMilestonesByProjectId(Long projectId) throws Exception {
    projectService.getProjectById(projectId);

    List<Milestone> milestones = milestoneRepository.findByProjectId(projectId);
    return milestones.stream()
      .map(this::convertToDtoWithProgress)
      .collect(Collectors.toList());
  }

  /**
   * Atualiza os dados de um marco existente.
   * Valida se as datas de início e término não estão no passado.
   *
   * @param milestoneId      ID do marco a ser atualizado
   * @param updatedMilestone Dados atualizados do marco
   * @return Entidade do marco atualizado
   * @throws Exception Se o marco não for encontrado
   */
  @Override
  public Milestone updateMilestone(Long milestoneId, Milestone updatedMilestone) throws Exception {
    Milestone milestone = getMilestoneById(milestoneId);

    if (updatedMilestone.getStartDate() != null && updatedMilestone.getStartDate().isBefore(LocalDate.now())) {
      throw new IllegalArgumentException("A data de início da milestone não pode ser no passado.");
    }
    if (updatedMilestone.getEndDate() != null && updatedMilestone.getEndDate().isBefore(LocalDate.now())) {
      throw new IllegalArgumentException("A data de término da milestone não pode ser no passado.");
    }

    milestone.setName(updatedMilestone.getName());
    milestone.setDescription(updatedMilestone.getDescription());
    milestone.setStartDate(updatedMilestone.getStartDate());
    milestone.setEndDate(updatedMilestone.getEndDate());
    milestone.setStatus(updatedMilestone.getStatus());

    return milestoneRepository.save(milestone);
  }

  /**
   * Exclui um marco, desassociando issues e verificando permissões.
   *
   * @param milestoneId ID do marco a ser excluído
   * @param userId      ID do usuário solicitante
   * @throws Exception Se o marco não for encontrado ou o usuário não tiver permissão
   */
  @Override
  public void deleteMilestone(Long milestoneId, Long userId) throws Exception {
    Milestone milestone = getMilestoneById(milestoneId);
    User user = userService.findUserById(userId);

    Project project = milestone.getProject();
    if (!project.getOwner().getId().equals(userId)) {
      throw new Exception("Usuário não tem permissão para deletar este milestone");
    }

    for (Issue issue : milestone.getIssues()) {
      if (issue.getMilestone() != null && issue.getMilestone().getId().equals(milestoneId)) {
        issue.setMilestone(null);
        issueRepository.save(issue);
      }
    }

    milestoneRepository.deleteById(milestoneId);
  }

  /**
   * Adiciona uma issue a um marco, validando compatibilidade de projeto.
   *
   * @param milestoneId ID do marco
   * @param issueId     ID da issue
   * @throws Exception Se a issue ou marco não forem encontrados ou pertencerem a projetos diferentes
   */
  @Override
  public void addIssueToMilestone(Long milestoneId, Long issueId) throws Exception {
    Milestone milestone = getMilestoneById(milestoneId);
    Optional<Issue> issueOptional = issueRepository.findById(issueId);

    if (issueOptional.isEmpty()) {
      throw new Exception("Issue não encontrada com id: " + issueId);
    }

    Issue issue = issueOptional.get();

    if (!issue.getProject().getId().equals(milestone.getProject().getId())) {
      throw new Exception("Esta issue não pertence ao mesmo projeto do milestone");
    }

    issue.setMilestone(milestone);
    issueRepository.save(issue);
  }

  /**
   * Remove uma issue de um marco.
   *
   * @param milestoneId ID do marco
   * @param issueId     ID da issue
   * @throws Exception Se a issue ou marco não forem encontrados
   */
  @Override
  public void removeIssueFromMilestone(Long milestoneId, Long issueId) throws Exception {
    getMilestoneById(milestoneId);

    Optional<Issue> issueOptional = issueRepository.findById(issueId);
    if (issueOptional.isEmpty()) {
      throw new Exception("Issue não encontrada com id: " + issueId);
    }

    Issue issue = issueOptional.get();
    issue.setMilestone(null);
    issueRepository.save(issue);
  }

  /**
   * Converte uma entidade Milestone para MilestoneDTO e calcula o progresso.
   *
   * @param milestone A entidade Milestone a ser convertida.
   * @return Um MilestoneDTO com a porcentagem de conclusão.
   */
  private MilestoneDTO convertToDtoWithProgress(Milestone milestone) {
    MilestoneDTO dto = new MilestoneDTO();
    dto.setId(milestone.getId());
    dto.setName(milestone.getName());
    dto.setDescription(milestone.getDescription());
    dto.setStartDate(milestone.getStartDate());
    dto.setEndDate(milestone.getEndDate());
    dto.setStatus(milestone.getStatus());
    dto.setProject(milestone.getProject());

    List<Issue> issues = issueRepository.findByMilestoneId(milestone.getId());
    int totalIssues = issues.size();
    long completedIssues = issues.stream()
      .filter(issue -> issue.getStatus() == IssueStatus.CONCLUIDO)
      .count();

    double percentage = (totalIssues > 0) ? ((double) completedIssues / totalIssues) * 100 : 0;

    dto.setTotalIssues(totalIssues);
    dto.setCompletedIssues((int) completedIssues);
    dto.setCompletionPercentage(percentage);

    return dto;
  }
}