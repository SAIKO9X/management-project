package com.project.management.controllers;

import com.project.management.models.entities.Comment;
import com.project.management.models.entities.User;
import com.project.management.request.CreateCommentRequest;
import com.project.management.response.MessageResponse;
import com.project.management.services.CommentService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gerenciamento de comentários associados a issues.
 * Fornece endpoints para criação, exclusão e recuperação de comentários com validação de autorização
 * baseada em JWT. Os comentários são sempre associados a issues específicas e apenas o autor
 * pode excluir seus próprios comentários.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

  private final CommentService commentService;
  private final UserService userService;

  /**
   * Cria um novo comentário para uma issue específica.
   * O usuário autenticado será automaticamente definido como autor do comentário.
   * Valida se o ID da issue foi fornecido na requisição.
   *
   * @param request dados do comentário incluindo ID da issue e conteúdo
   * @return ResponseEntity contendo o comentário criado com status HTTP 201 (CREATED)
   * @throws Exception                se houver erro na autenticação do usuário ou validação dos dados
   * @throws IllegalArgumentException se o ID da issue for nulo
   */
  @PostMapping
  public ResponseEntity<Comment> createComment(@RequestBody CreateCommentRequest request) throws Exception {
    if (request.getIssueId() == null || request.getUserId() == null) {
      throw new IllegalArgumentException("Os IDs da issue e do usuário não podem ser nulos");
    }

    Comment createdComment = commentService.createComment(request.getIssueId(), request.getUserId(), request.getContent());

    return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
  }

  /**
   * Exclui um comentário existente com validação de autorização.
   * Apenas o autor do comentário pode excluí-lo.
   *
   * @param commentId ID do comentário a ser excluído
   * @param jwt       token JWT para autenticação do usuário
   * @return ResponseEntity contendo mensagem de sucesso com status HTTP 200 (OK)
   * @throws Exception se o comentário não for encontrado, usuário não autenticado ou sem permissão
   */
  @DeleteMapping("/{commentId}")
  public ResponseEntity<MessageResponse> deleteComment(@PathVariable Long commentId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    commentService.deleteComment(commentId, user.getId());
    MessageResponse response = new MessageResponse();
    response.setMessage("comentario deletado com sucesso");

    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  /**
   * Recupera todos os comentários associados a uma issue específica.
   * Este endpoint é público e não requer autenticação, permitindo que qualquer usuário
   * visualize os comentários de uma issue.
   *
   * @param issueId ID da issue para recuperar os comentários
   * @return ResponseEntity contendo a lista de comentários da issue com status HTTP 200 (OK)
   */
  @GetMapping("/{issueId}")
  public ResponseEntity<List<Comment>> getCommentByIssueId(@PathVariable Long issueId) {
    System.out.println("Request to get comments by issueId received");
    List<Comment> comments = commentService.findCommentByIssueId(issueId);

    return new ResponseEntity<>(comments, HttpStatus.OK);
  }

  @PutMapping("/{commentId}")
  public ResponseEntity<Comment> updateComment(
    @PathVariable Long commentId,
    @RequestBody String content,
    @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);
    Comment updatedComment = commentService.updateComment(commentId, user.getId(), content);
    return new ResponseEntity<>(updatedComment, HttpStatus.OK);
  }
}