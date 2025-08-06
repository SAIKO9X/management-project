package com.project.management.services.impl;

import com.project.management.models.entities.Invitation;
import com.project.management.repositories.InvitationRepository;
import com.project.management.services.EmailService;
import com.project.management.services.InvitationService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Implementação do serviço para gerenciamento de convites a projetos.
 * Responsável por criar, validar e excluir convites, integrando com envio de emails.
 */
@Service
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

  private final InvitationRepository invitationRepository;
  private final EmailService emailService;

  /**
   * Envia um convite para participação em um projeto.
   *
   * @param email     Endereço de email do destinatário
   * @param projectId ID do projeto associado ao convite
   * @throws MessagingException Se ocorrer erro no envio do email
   */
  @Override
  public void sendInvitation(String email, Long projectId) throws MessagingException {
    String invitationToken = UUID.randomUUID().toString();

    Invitation invitation = new Invitation();
    invitation.setEmail(email);
    invitation.setProjectId(projectId);
    invitation.setToken(invitationToken);

    invitationRepository.save(invitation);

    String invitationLink = "http://localhost:5173/accept_invitation?token=" + invitationToken;
    emailService.sendEmailWithToken(email, invitationLink, "INVITATION");
  }

  /**
   * Valida e aceita um convite com base no token fornecido.
   *
   * @param token  Token do convite
   * @param userId ID do usuário que aceita o convite
   * @return Entidade do convite aceito
   * @throws Exception Se o token for inválido
   */
  @Override
  public Invitation acceptInvitation(String token, Long userId) throws Exception {
    Invitation invitation = invitationRepository.findByToken(token);

    if (invitation == null) {
      throw new Exception("Token de convite inválido");
    }

    return invitation;
  }

  /**
   * Recupera o token de convite associado a um email.
   *
   * @param userEmail Email do usuário
   * @return Token do convite
   */
  @Override
  public String getTokenByUserMail(String userEmail) {
    Invitation invitation = invitationRepository.findByEmail(userEmail);
    return invitation.getToken();
  }

  /**
   * Exclui um convite com base no token.
   *
   * @param token Token do convite a ser excluído
   */
  @Override
  public void deleteToken(String token) {
    Invitation invitation = invitationRepository.findByToken(token);
    invitationRepository.delete(invitation);
  }
}