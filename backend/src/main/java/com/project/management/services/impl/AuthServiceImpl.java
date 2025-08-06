package com.project.management.services.impl;

import com.project.management.config.JwtProvider;
import com.project.management.models.entities.User;
import com.project.management.repositories.UserRepository;
import com.project.management.request.LoginRequest;
import com.project.management.request.RefreshTokenRequest;
import com.project.management.response.ApiResponse;
import com.project.management.response.AuthResponse;
import com.project.management.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Implementação do serviço de autenticação e gerenciamento de tokens JWT.
 * Fornece operações para registro, login e renovação de tokens com validação de credenciais e gerenciamento de sessão.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final CustomUserDetailsImpl customUserDetails;
  private final JwtProvider jwtProvider;

  /**
   * Registra um novo usuário no sistema.
   *
   * @param user dados do usuário a ser registrado
   * @return resposta com tokens JWT e status da operação
   * @throws Exception se o email já estiver cadastrado
   */
  @Override
  public ApiResponse register(User user) throws Exception {
    User isUserExist = userRepository.findByEmail(user.getEmail());

    if (isUserExist != null) {
      return new ApiResponse(null, null, "Uma conta já foi cadastrada usando esse email", false);
    }

    User createdUser = new User();
    createdUser.setEmail(user.getEmail());
    createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
    createdUser.setFullName(user.getFullName());

    User savedUser = userRepository.save(createdUser);

    Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), null);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String accessToken = jwtProvider.generateAccessToken(authentication);
    String refreshToken = jwtProvider.generateRefreshToken(authentication);

    return new ApiResponse(accessToken, refreshToken, "Cadastrado com sucesso", true);
  }

  /**
   * Autentica um usuário existente no sistema.
   *
   * @param loginRequest dados de login contendo email e senha
   * @return resposta com tokens JWT gerados
   * @throws Exception se as credenciais forem inválidas
   */
  @Override
  public AuthResponse login(LoginRequest loginRequest) throws Exception {
    String username = loginRequest.email();
    String password = loginRequest.password();

    Authentication authentication = authenticate(username, password);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String accessToken = jwtProvider.generateAccessToken(authentication);
    String refreshToken = jwtProvider.generateRefreshToken(authentication);

    return new AuthResponse(accessToken, refreshToken, "Login realizado com sucesso");
  }

  /**
   * Renova o token de acesso utilizando um refresh token válido.
   *
   * @param request requisição contendo o refresh token
   * @return resposta com novo access token ou erro se inválido
   * @throws Exception se o refresh token for inválido ou expirado
   */
  @Override
  public ApiResponse refreshToken(RefreshTokenRequest request) throws Exception {
    String refreshToken = request.refreshToken();
    String email = jwtProvider.getEmailFromToken(refreshToken);

    if (email != null && jwtProvider.isTokenValid(refreshToken)) {
      Authentication authentication = new UsernamePasswordAuthenticationToken(email, null);
      String newAccessToken = jwtProvider.generateAccessToken(authentication);
      return new ApiResponse(newAccessToken, refreshToken, "Token renovado com sucesso", true);
    } else {
      return new ApiResponse(null, null, "Refresh token inválido ou expirado", false);
    }
  }

  /**
   * Valida as credenciais do usuário e cria objeto de autenticação.
   *
   * @param username email do usuário
   * @param password senha do usuário
   * @return objeto de autenticação do Spring Security
   * @throws BadCredentialsException se as credenciais forem inválidas
   */
  private Authentication authenticate(String username, String password) {
    UserDetails userDetails = customUserDetails.loadUserByUsername(username);

    if (userDetails == null) {
      throw new BadCredentialsException("Email não encontrado");
    }

    if (!passwordEncoder.matches(password, userDetails.getPassword())) {
      throw new BadCredentialsException("Senha inválida");
    }

    return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
  }
}