package com.project.management.services.impl;

import com.project.management.models.entities.Chat;
import com.project.management.models.entities.Message;
import com.project.management.models.entities.User;
import com.project.management.repositories.MessageRepository;
import com.project.management.repositories.UserRepository;
import com.project.management.services.MessageService;
import com.project.management.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementação do serviço para gerenciamento de mensagens em chats de projetos.
 * Gerencia envio e recuperação de mensagens, integrando com projetos e usuários.
 */
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

  private final MessageRepository messageRepository;
  private final UserRepository userRepository;
  private final ProjectService projectService;

  /**
   * Envia uma mensagem em um chat de projeto.
   *
   * @param senderId  ID do usuário remetente
   * @param projectId ID do projeto associado ao chat
   * @param content   Conteúdo da mensagem
   * @return Entidade da mensagem enviada
   * @throws Exception Se o usuário, projeto ou chat não forem encontrados
   */
  @Override
  public Message sendMessage(Long senderId, Long projectId, String content) throws Exception {
    User sender = userRepository.findById(senderId).orElseThrow(() -> new Exception("Usuário não encontrado para o id: " + senderId));

    Chat chat = projectService.getProjectById(projectId).getChat();

    if (chat == null) {
      throw new Exception("Chat não encontrado para o projeto: " + projectId);
    }

    Message message = new Message();
    message.setContent(content);
    message.setSender(sender);
    message.setCreatedAt(LocalDateTime.now());
    message.setChat(chat);
    Message savedMessage = messageRepository.save(message);

    chat.getMessages().add(savedMessage);
    return savedMessage;
  }

  /**
   * Recupera todas as mensagens de um projeto, ordenadas por data de criação.
   *
   * @param projectId ID do projeto
   * @return Lista de mensagens do projeto
   * @throws Exception Se o projeto ou chat não forem encontrados
   */
  @Override
  public List<Message> getMessageByProjectId(Long projectId) throws Exception {
    Chat chat = projectService.getChatByProjectId(projectId);
    return messageRepository.findByChatIdOrderByCreatedAtAsc(chat.getId());
  }
}
