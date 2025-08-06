package com.project.management.services.impl;

import com.project.management.models.entities.Comment;
import com.project.management.models.entities.Issue;
import com.project.management.models.entities.User;
import com.project.management.repositories.CommentRepository;
import com.project.management.repositories.IssueRepository;
import com.project.management.repositories.UserRepository;
import com.project.management.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementação do serviço para gerenciamento de comentários associados a issues.
 * Fornece operações para criação, exclusão e recuperação de comentários, com validação de autorização e verificação de entidades.
 */
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

  private final CommentRepository commentRepository;
  private final IssueRepository issueRepository;
  private final UserRepository userRepository;

  /**
   * Cria um novo comentário para uma issue.
   *
   * @param issueId ID da issue à qual o comentário será associado
   * @param userId  ID do usuário que está criando o comentário
   * @param content conteúdo do comentário
   * @return entidade do comentário salvo
   * @throws Exception se a issue ou usuário não forem encontrados
   */
  @Override
  public Comment createComment(Long issueId, Long userId, String content) throws Exception {
    Optional<Issue> issueOptional = issueRepository.findById(issueId);
    Optional<User> userOptional = userRepository.findById(userId);

    if (issueOptional.isEmpty()) {
      throw new Exception("Issue não encontrada para o id: " + issueId);
    }

    if (userOptional.isEmpty()) {
      throw new Exception("Usuário não encontrado para o id: " + userId);
    }

    Issue issue = issueOptional.get();
    User user = userOptional.get();

    Comment comment = new Comment();
    comment.setIssue(issue);
    comment.setUser(user);
    comment.setContent(content);

    Comment savedComment = commentRepository.save(comment);
    issue.getComments().add(savedComment);

    return savedComment;
  }

  /**
   * Exclui um comentário com validação de autorização.
   * Apenas o autor do comentário pode excluir seus próprios comentários.
   *
   * @param commentId ID do comentário a ser excluído
   * @param userId    ID do usuário solicitando a exclusão
   * @throws Exception se o comentário ou usuário não forem encontrados, ou se o usuário não tiver permissão
   */
  @Override
  public void deleteComment(Long commentId, Long userId) throws Exception {
    Optional<Comment> commentOptional = commentRepository.findById(commentId);
    Optional<User> userOptional = userRepository.findById(userId);

    if (commentOptional.isEmpty()) {
      throw new Exception("Comentário não encontrado para o id: " + commentId);
    }

    if (userOptional.isEmpty()) {
      throw new Exception("Usuário não encontrado para o id: " + userId);
    }

    Comment comment = commentOptional.get();
    User user = userOptional.get();

    if (!comment.getUser().equals(user)) {
      throw new Exception("O usuário não tem permissão para excluir este comentário!");
    }

    commentRepository.delete(comment);
  }

  /**
   * Recupera todos os comentários associados a uma issue específica.
   *
   * @param issueId ID da issue
   * @return lista de comentários da issue especificada
   */
  @Override
  public List<Comment> findCommentByIssueId(Long issueId) {
    return commentRepository.findByIssueId(issueId);
  }
}