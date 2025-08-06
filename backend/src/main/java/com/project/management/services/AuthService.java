package com.project.management.services;

import com.project.management.models.entities.User;
import com.project.management.request.LoginRequest;
import com.project.management.request.RefreshTokenRequest;
import com.project.management.response.ApiResponse;
import com.project.management.response.AuthResponse;

public interface AuthService {
  ApiResponse register(User user) throws Exception;

  AuthResponse login(LoginRequest loginRequest) throws Exception;

  ApiResponse refreshToken(RefreshTokenRequest request) throws Exception;
}