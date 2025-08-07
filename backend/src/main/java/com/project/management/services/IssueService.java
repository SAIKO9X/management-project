package com.project.management.services;

import com.project.management.models.entities.Issue;
import com.project.management.models.entities.User;
import com.project.management.request.IssueRequest;

import java.util.List;

public interface IssueService {
  Issue getIssueById(Long issueId) throws Exception;

  List<Issue> getIssueByProjectId(Long projectId) throws Exception;

  Issue createIssue(IssueRequest issueRequest, User user) throws Exception;

  Issue updateIssue(Long issueId, String status) throws Exception;

  void deleteIssue(Long issueId, Long userId) throws Exception;

  Issue addUserToIssue(Long issueId, Long userId) throws Exception;

  Issue updateIssueFull(Long issueId, IssueRequest issueRequest, Long userId) throws Exception;
}