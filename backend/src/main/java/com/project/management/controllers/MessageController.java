package com.project.management.controllers;

import com.project.management.models.entities.Chat;
import com.project.management.models.entities.Message;
import com.project.management.models.entities.User;
import com.project.management.request.CreateMessageRequest;
import com.project.management.response.MessageResponse;
import com.project.management.services.MessageService;
import com.project.management.services.ProjectService;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsável pelos endpoints de gerenciamento de mensagens.
 * Fornece operações para envio de mensagens e recuperação do histórico de chat
 * com validação adequada e tratamento de erros.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessageController {

  private final MessageService messageService;
  private final UserService userService;
  private final ProjectService projectService;

  /**
   * Envia uma nova mensagem para o chat de um projeto específico.
   *
   * @param request dados da mensagem incluindo ID do remetente, ID do projeto e conteúdo
   * @return mensagem enviada com sucesso ou erro se usuário/chat não encontrado
   * @throws Exception se o usuário não for encontrado ou o chat não existir
   */
  @PostMapping("/send")
  public ResponseEntity<Message> sendMessage(@RequestBody CreateMessageRequest request) throws Exception {

    User user = userService.findUserById(request.senderId());
    if (user == null) throw new Exception("Usuário não encontrado para o id: " + request.senderId());

    Chat chats = projectService.getChatByProjectId(request.projectId()).getProject().getChat();
    if (chats == null) throw new Exception("Chat não encontrado");

    Message sentMessage = messageService.sendMessage(request.senderId(), request.projectId(), request.content());

    return ResponseEntity.ok(sentMessage);
  }

  /**
   * Recupera todas as mensagens de um chat específico baseado no ID do projeto.
   *
   * @param projectId identificador do projeto para buscar as mensagens do chat
   * @return lista de mensagens do chat ordenadas ou erro se projeto não encontrado
   * @throws Exception se o projeto não existir ou ocorrer erro na busca
   */
  @GetMapping("/chat/{projectId}")
  public ResponseEntity<List<Message>> getMessageByChatId(@PathVariable Long projectId) throws Exception {

    // Busca todas as mensagens do chat do projeto
    List<Message> messages = messageService.getMessageByProjectId(projectId);

    return ResponseEntity.ok(messages);
  }

  @DeleteMapping("/{messageId}")
  public ResponseEntity<MessageResponse> deleteMessage(@PathVariable Long messageId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    messageService.deleteMessage(messageId, user.getId());
    return new ResponseEntity<>(new MessageResponse("Mensagem deletada com sucesso"), HttpStatus.OK);
  }

  @PutMapping("/{messageId}")
  public ResponseEntity<Message> updateMessage(
    @PathVariable Long messageId,
    @RequestBody String content,
    @RequestHeader("Authorization") String jwt
  ) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    Message updatedMessage = messageService.updateMessage(messageId, user.getId(), content);
    return new ResponseEntity<>(updatedMessage, HttpStatus.OK);
  }
}