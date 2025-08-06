package com.project.management.services;

import jakarta.mail.MessagingException;

public interface EmailService {

  void sendEmailWithToken(String userEmail, String link, String messageType) throws MessagingException;

}