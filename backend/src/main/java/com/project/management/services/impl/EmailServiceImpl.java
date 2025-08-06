package com.project.management.services.impl;

import com.project.management.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Implementação do serviço de envio de emails com templates HTML.
 * Gerencia diferentes tipos de emails transacionais utilizando templates personalizados para convites de projeto e recuperação de senha.
 */
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender javaMailSender;

  /**
   * Envia email com link personalizado baseado no tipo de mensagem.
   *
   * @param userEmail   endereço de destino do email
   * @param link        URL a ser incluída no template do email
   * @param messageType tipo da mensagem ("INVITATION" ou "PASSWORD_RESET")
   * @throws MessagingException se ocorrer erro no envio ou processamento do template
   */
  @Override
  public void sendEmailWithToken(String userEmail, String link, String messageType) throws MessagingException {
    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

    String subject;
    String htmlContent;

    if ("INVITATION".equalsIgnoreCase(messageType)) {
      subject = "✨ Convite para Projeto em Equipe - Project Management System";
      htmlContent = buildInvitationEmailTemplate(link);
    } else if ("PASSWORD_RESET".equalsIgnoreCase(messageType)) {
      subject = "🔐 Redefinição de Senha - Project Management System";
      htmlContent = buildPasswordResetEmailTemplate(link);
    } else {
      throw new IllegalArgumentException("Tipo de mensagem inválido: " + messageType);
    }

    helper.setSubject(subject);
    helper.setText(htmlContent, true);
    helper.setTo(userEmail);

    try {
      javaMailSender.send(mimeMessage);
    } catch (MailSendException e) {
      throw new MailSendException("Erro ao enviar o email");
    }
  }

  /**
   * Carrega e processa template HTML para convites de projeto.
   *
   * @param link URL do convite a ser inserida no template
   * @return conteúdo HTML processado com o link substituído
   * @throws MessagingException se o template não puder ser carregado
   */
  private String buildInvitationEmailTemplate(String link) throws MessagingException {
    try {
      String templatePath = "templates/email/invitation_email.html";
      ClassPathResource resource = new ClassPathResource(templatePath);
      String htmlContent = new String(Files.readAllBytes(Paths.get(resource.getURI())));
      return htmlContent.replace("${link}", link);
    } catch (Exception e) {
      throw new MessagingException("Erro ao carregar o template de convite", e);
    }
  }

  /**
   * Carrega e processa template HTML para recuperação de senha.
   *
   * @param link URL de reset a ser inserida no template
   * @return conteúdo HTML processado com o link substituído
   * @throws MessagingException se o template não puder ser carregado
   */
  private String buildPasswordResetEmailTemplate(String link) throws MessagingException {
    try {
      String templatePath = "templates/email/password_reset_email.html";
      ClassPathResource resource = new ClassPathResource(templatePath);
      String htmlContent = new String(Files.readAllBytes(Paths.get(resource.getURI())));
      return htmlContent.replace("${link}", link);
    } catch (Exception e) {
      throw new MessagingException("Erro ao carregar o template de redefinição de senha", e);
    }
  }
}