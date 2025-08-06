package com.project.management.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
  private String accessToken;
  private String refreshToken;
  private String message;
  private boolean success;
}