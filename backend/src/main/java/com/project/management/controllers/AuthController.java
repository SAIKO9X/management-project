package com.project.management.controllers;

import com.project.management.models.entities.PasswordResetToken;
import com.project.management.models.entities.User;
import com.project.management.repositories.PasswordResetTokenRepository;
import com.project.management.repositories.UserRepository;
import com.project.management.request.LoginRequest;
import com.project.management.request.RefreshTokenRequest;
import com.project.management.response.ApiResponse;
import com.project.management.response.AuthResponse;
import com.project.management.services.AuthService;
import com.project.management.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;
  private final UserRepository userRepository;
  private final PasswordResetTokenRepository tokenRepository;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<ApiResponse> register(@RequestBody User user) throws Exception {
    ApiResponse response = authService.register(user);
    HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
    return new ResponseEntity<>(response, status);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) throws Exception {
    AuthResponse response = authService.login(loginRequest);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) throws Exception {
    ApiResponse apiResponse = authService.refreshToken(request);

    if (apiResponse.isSuccess()) {
      AuthResponse authResponse = new AuthResponse(apiResponse.getAccessToken(), apiResponse.getRefreshToken(), apiResponse.getMessage());
      return new ResponseEntity<>(authResponse, HttpStatus.OK);
    } else {
      AuthResponse errorResponse = new AuthResponse(null, null, apiResponse.getMessage());
      return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<ApiResponse> forgotPassword(@RequestParam String email) throws Exception {
    User user = userRepository.findByEmail(email);
    if (user == null) {
      return new ResponseEntity<>(new ApiResponse(null, null, "Usuário não encontrado", false), HttpStatus.NOT_FOUND);
    }

    String token = UUID.randomUUID().toString();
    PasswordResetToken resetToken = new PasswordResetToken(token, user);
    tokenRepository.save(resetToken);

    String resetLink = "http://localhost:5173/reset-password?token=" + token;
    emailService.sendEmailWithToken(email, resetLink, "PASSWORD_RESET");

    return new ResponseEntity<>(new ApiResponse(null, null, "Email de redefinição enviado com sucesso", true), HttpStatus.OK);
  }

  @PostMapping("/reset-password")
  public ResponseEntity<ApiResponse> resetPassword(@RequestParam String token, @RequestParam String newPassword) throws Exception {
    PasswordResetToken resetToken = tokenRepository.findByToken(token).orElseThrow(() -> new Exception("Token inválido"));

    if (resetToken.isExpired()) {
      tokenRepository.delete(resetToken);
      return new ResponseEntity<>(new ApiResponse(null, null, "Token expirado", false), HttpStatus.BAD_REQUEST);
    }

    User user = resetToken.getUser();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    tokenRepository.delete(resetToken);

    return new ResponseEntity<>(new ApiResponse(null, null, "Senha redefinida com sucesso", true), HttpStatus.OK);
  }
}