package com.project.management.services;

import com.project.management.models.entities.Invitation;
import jakarta.mail.MessagingException;

public interface InvitationService {

    public void sendInvitation (String email, Long projectId) throws MessagingException;

    public Invitation acceptInvitation(String token, Long userId) throws Exception;

    public String getTokenByUserMail (String userEmail);

    void deleteToken(String token);
}
