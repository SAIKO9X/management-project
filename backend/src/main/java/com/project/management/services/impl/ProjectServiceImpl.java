package com.project.management.services.impl;

import com.project.management.models.entities.*;
import com.project.management.repositories.CategoryRepository;
import com.project.management.repositories.ProjectRepository;
import com.project.management.repositories.TagRepository;
import com.project.management.services.ChatService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Implementação do serviço para gerenciamento de projetos.
 * Fornece operações para criação, atualização, exclusão e manipulação de projetos, incluindo equipes e chats.
 */
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

  private final ProjectRepository projectRepository;
  private final UserService userService;
  private final ChatService chatService;
  private final TagRepository tagRepository;
  private final CategoryRepository categoryRepository;

  /**
   * Cria um novo projeto com configurações iniciais.
   *
   * @param project Projeto a ser criado
   * @param user    Usuário proprietário do projeto
   * @return Entidade do projeto criado
   * @throws Exception Se a categoria não for encontrada
   */
  @Override
  public Project createProject(Project project, User user) throws Exception {
    Project createdProject = new Project();
    createdProject.setOwner(user);
    createdProject.setName(project.getName());
    createdProject.setDescription(project.getDescription());
    createdProject.setStatus(project.getStatus() != null ? project.getStatus() : "Em Progresso");
    createdProject.setIcon(project.getIcon());
    createdProject.getTeam().add(user);
    createdProject.setOwner(user);

    ProjectRole ownerRole = new ProjectRole();
    ownerRole.setUser(user);
    ownerRole.setProject(createdProject);
    ownerRole.setRole(ProjectRole.Role.OWNER);
    createdProject.getRoles().add(ownerRole);

    if (project.getCategory() != null && project.getCategory().getName() != null) {
      Optional<Category> existingCategory = categoryRepository.findByNameAndOwner(project.getCategory().getName(), user);
      if (existingCategory.isPresent()) {
        createdProject.setCategory(existingCategory.get());
      } else {
        throw new Exception("Categoria '" + project.getCategory().getName() + "' não encontrada para o usuário.");
      }
    } else {
      createdProject.setCategory(null);
    }

    if (project.getTags() != null && !project.getTags().isEmpty()) {
      List<Tag> existingTags = tagRepository.findByOwnerAndNameIn(user, project.getTags().stream().map(Tag::getName).toList());
      createdProject.setTags(existingTags);
    } else {
      createdProject.setTags(new ArrayList<>());
    }

    Project savedProject = projectRepository.save(createdProject);

    Chat chat = new Chat();
    chat.setProject(savedProject);
    Chat projectChat = chatService.createChat(chat);
    savedProject.setChat(projectChat);

    return savedProject;
  }

  /**
   * Recupera projetos associados a um usuário, filtrados por categoria ou tag.
   *
   * @param user         Usuário membro ou proprietário dos projetos
   * @param categoryName Nome da categoria para filtro (opcional)
   * @param tagName      Nome da tag para filtro (opcional)
   * @return Lista de projetos filtrados
   * @throws Exception Se ocorrer erro na consulta
   */
  @Override
  public List<Project> getProjectByTeam(User user, String categoryName, String tagName) throws Exception {
    List<Project> projects = projectRepository.findByTeamContainingOrOwner(user, user);

    if (categoryName != null) {
      projects = projects.stream().filter(project -> project.getCategory() != null && project.getCategory().getName().equals(categoryName)).toList();
    }

    if (tagName != null) {
      projects = projects.stream().filter(project -> project.getTags().stream().anyMatch(tag -> tag.getName().equals(tagName))).toList();
    }

    return projects;
  }

  /**
   * Recupera um projeto pelo seu ID.
   *
   * @param projectId ID do projeto
   * @return Entidade do projeto encontrado
   * @throws Exception Se o projeto não for encontrado
   */
  @Override
  public Project getProjectById(Long projectId) throws Exception {
    Optional<Project> optionalProject = projectRepository.findById(projectId);

    if (optionalProject.isEmpty()) {
      throw new Exception("Projeto não encontrado");
    }

    Project project = optionalProject.get();
    project.getRoles().size();
    project.getRoles().forEach(role -> {
      if (role.getUser() != null) {
        role.getUser().getFullName();
      }
    });

    return project;
  }

  /**
   * Exclui um projeto, verificando permissões do usuário.
   *
   * @param projectId ID do projeto a ser excluído
   * @param userId    ID do usuário solicitando a exclusão
   * @throws Exception Se o projeto não for encontrado ou o usuário não tiver permissão
   */
  @Override
  public void deleteProject(Long projectId, Long userId) throws Exception {
    Project project = getProjectById(projectId);
    if (!project.getOwner().getId().equals(userId)) {
      throw new Exception("Você não tem permissão para deletar este projeto.");
    }
    projectRepository.deleteById(projectId);
  }

  /**
   * Atualiza os dados de um projeto, verificando permissões.
   *
   * @param updateProject Dados atualizados do projeto
   * @param id            ID do projeto
   * @param userId        ID do usuário solicitando a atualização
   * @return Entidade do projeto atualizado
   * @throws Exception Se o projeto não for encontrado, o usuário não tiver permissão ou a categoria for inválida
   */
  @Override
  public Project updateProject(Project updateProject, Long id, Long userId) throws Exception {
    Project project = getProjectById(id);
    User user = userService.findUserById(userId);

    if (!project.getOwner().getId().equals(user.getId())) {
      throw new Exception("Você não tem permissão para modificar este projeto.");
    }

    project.setName(updateProject.getName());
    project.setDescription(updateProject.getDescription());
    project.setStatus(updateProject.getStatus());
    project.setIcon(updateProject.getIcon());

    if (updateProject.getCategory() != null && updateProject.getCategory().getName() != null) {
      Optional<Category> existingCategory = categoryRepository.findByNameAndOwner(updateProject.getCategory().getName(), user);
      if (existingCategory.isPresent()) {
        project.setCategory(existingCategory.get());
      } else {
        throw new Exception("Categoria '" + updateProject.getCategory().getName() + "' não encontrada para o usuário.");
      }
    } else {
      project.setCategory(null);
    }

    if (updateProject.getTags() != null && !updateProject.getTags().isEmpty()) {
      List<Tag> existingTags = tagRepository.findByOwnerAndNameIn(user, updateProject.getTags().stream().map(Tag::getName).toList());
      project.setTags(existingTags);
    } else {
      project.setTags(new ArrayList<>());
    }

    return projectRepository.save(project);
  }

  /**
   * Adiciona um usuário a um projeto com um papel específico, via solicitação autenticada.
   *
   * @param projectId ID do projeto
   * @param userId    ID do usuário a ser adicionado
   * @param roleName  Nome do papel a ser atribuído
   * @param jwt       Token JWT do solicitante
   * @throws Exception Se o usuário já estiver no projeto, o solicitante não for proprietário ou o papel for inválido
   */
  @Override
  public void addUserToProject(Long projectId, Long userId, String roleName, String jwt) throws Exception {
    Project project = getProjectById(projectId);
    User user = userService.findUserById(userId);
    User requester = userService.findUserProfileByJwt(jwt);

    if (!isOwner(requester, project)) {
      throw new Exception("Apenas o Owner pode gerenciar cargos.");
    }

    ProjectRole.Role newRole = ProjectRole.Role.valueOf(roleName.toUpperCase());

    Optional<ProjectRole> existingRoleOpt = project.getRoles().stream()
      .filter(r -> r.getUser().getId().equals(userId))
      .findFirst();

    if (existingRoleOpt.isPresent()) {
      ProjectRole existingRole = existingRoleOpt.get();
      existingRole.setRole(newRole);
    } else {
      if (!project.getTeam().contains(user)) {
        project.getTeam().add(user);
      }
      ProjectRole projectRole = new ProjectRole();
      projectRole.setUser(user);
      projectRole.setProject(project);
      projectRole.setRole(newRole);
      project.getRoles().add(projectRole);
    }

    if (project.getChat() != null && !project.getChat().getUsers().contains(user)) {
      project.getChat().getUsers().add(user);
    }

    projectRepository.save(project);
  }

  /**
   * Adiciona um usuário a um projeto via convite, com um papel específico.
   *
   * @param projectId ID do projeto
   * @param userId    ID do usuário a ser adicionado
   * @param roleName  Nome do papel a ser atribuído
   * @throws Exception Se o usuário já estiver no projeto ou o papel for inválido
   */
  @Override
  public void addUserToProjectByInvitation(Long projectId, Long userId, String roleName) throws Exception {
    Project project = getProjectById(projectId);
    User user = userService.findUserById(userId);

    boolean userAlreadyInProject = project.getRoles().stream().anyMatch(role -> role.getUser().getId().equals(userId));

    if (userAlreadyInProject) {
      throw new Exception("Usuário já está no projeto.");
    }

    if (!project.getTeam().contains(user)) {
      project.getTeam().add(user);
    }

    ProjectRole.Role role = ProjectRole.Role.valueOf(roleName.toUpperCase());
    ProjectRole projectRole = new ProjectRole();
    projectRole.setUser(user);
    projectRole.setProject(project);
    projectRole.setRole(role);
    project.getRoles().add(projectRole);

    if (project.getChat() != null && !project.getChat().getUsers().contains(user)) {
      project.getChat().getUsers().add(user);
    }

    projectRepository.save(project);
  }

  /**
   * Remove um usuário de um projeto e seu chat associado.
   *
   * @param projectId ID do projeto
   * @param userId    ID do usuário a ser removido
   * @throws Exception Se o projeto ou usuário não forem encontrados
   */
  @Override
  public void removeUserFromProject(Long projectId, Long userId) throws Exception {
    Project project = getProjectById(projectId);
    User user = userService.findUserById(userId);

    if (project.getTeam().contains(user)) {
      project.getChat().getUsers().remove(user);
      project.getTeam().remove(user);
      projectRepository.save(project);
    }
  }

  /**
   * Recupera o chat associado a um projeto.
   *
   * @param projectId ID do projeto
   * @return Entidade do chat associado
   * @throws Exception Se o projeto ou chat não forem encontrados
   */
  @Override
  public Chat getChatByProjectId(Long projectId) throws Exception {
    Project project = getProjectById(projectId);
    return project.getChat();
  }

  /**
   * Busca projetos por palavra-chave no nome, associados a um usuário.
   *
   * @param keyword Palavra-chave para busca
   * @param user    Usuário membro ou proprietário dos projetos
   * @return Lista de projetos correspondentes
   * @throws Exception Se ocorrer erro na consulta
   */
  @Override
  public List<Project> searchProjects(String keyword, User user) throws Exception {
    return projectRepository.findByNameContainingAndTeamContains(keyword, user);
  }

  /**
   * Recupera todas as tags de um usuário.
   *
   * @param user Usuário proprietário das tags
   * @return Lista de tags do usuário
   * @throws Exception Se ocorrer erro na consulta
   */
  @Override
  public List<Tag> getUserTags(User user) throws Exception {
    return tagRepository.findByOwner(user);
  }

  /**
   * Recupera todas as categorias de um usuário.
   *
   * @param user Usuário proprietário das categorias
   * @return Lista de categorias do usuário
   * @throws Exception Se ocorrer erro na consulta
   */
  @Override
  public List<Category> getUserCategories(User user) throws Exception {
    return categoryRepository.findByOwner(user);
  }

  /**
   * Verifica se um usuário é proprietário de um projeto.
   *
   * @param user    Usuário a ser verificado
   * @param project Projeto a ser verificado
   * @return Verdadeiro se o usuário for proprietário
   */
  public boolean isOwner(User user, Project project) {
    return project.getRoles().stream().anyMatch(r -> r.getUser().getId().equals(user.getId()) && r.getRole() == ProjectRole.Role.OWNER);
  }
}