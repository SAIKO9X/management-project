package com.project.management.services;

import com.project.management.models.entities.Message;

import java.util.List;

public interface MessageService {

    Message sendMessage(Long senderId, Long projectId, String content) throws Exception;

    List<Message> getMessageByProjectId(Long projectId) throws Exception;

    void deleteMessage(Long messageId, Long userId) throws Exception;

    Message updateMessage(Long messageId, Long userId, String content) throws Exception;
}
