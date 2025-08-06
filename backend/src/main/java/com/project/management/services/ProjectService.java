package com.project.management.services;

import com.project.management.models.entities.*;

import java.util.List;

public interface ProjectService {
  Project createProject(Project project, User user) throws Exception;

  List<Project> getProjectByTeam(User user, String category, String tag) throws Exception;

  Project getProjectById(Long projectId) throws Exception;

  void deleteProject(Long projectId, Long userId) throws Exception;

  Project updateProject(Project updateProject, Long id, Long userId) throws Exception;

  void addUserToProject(Long projectId, Long userId, String roleName, String jwt) throws Exception;

  void addUserToProjectByInvitation(Long projectId, Long userId, String roleName) throws Exception;

  void removeUserFromProject(Long projectId, Long userId) throws Exception;

  Chat getChatByProjectId(Long projectId) throws Exception;

  List<Project> searchProjects(String keyword, User user) throws Exception;

  List<Tag> getUserTags(User user) throws Exception;

  List<Category> getUserCategories(User user) throws Exception;

  boolean isOwner(User user, Project project);
}