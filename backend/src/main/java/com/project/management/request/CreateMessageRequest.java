package com.project.management.request;

public record CreateMessageRequest(Long senderId, String content, Long projectId) {
}
