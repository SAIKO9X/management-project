package com.project.management.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

/**
 * Componente responsável pela geração e validação de tokens JWT.
 */
@Component
public class JwtProvider {

  @Value("${jwt.secret}")
  private String jwtSecret;

  /**
   * Gera um token de acesso com expiração de 1 hora.
   * Inclui o email do usuário e suas permissões como claims.
   */
  public String generateAccessToken(Authentication authentication) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + 3600000); // 1 hora
    return JWT.create()
      .withSubject(authentication.getName())
      .withIssuedAt(now)
      .withExpiresAt(expiryDate)
      .withClaim("authorities", authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(",")))
      .sign(Algorithm.HMAC256(jwtSecret));
  }

  /**
   * Gera um token de atualização com expiração de 7 dias.
   * Inclui o email do usuário e suas permissões como claims.
   */
  public String generateRefreshToken(Authentication authentication) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + 604800000); // 7 dias
    return JWT.create()
      .withSubject(authentication.getName())
      .withIssuedAt(now)
      .withExpiresAt(expiryDate)
      .withClaim("authorities", authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(",")))
      .sign(Algorithm.HMAC256(jwtSecret));
  }

  /**
   * Extrai o email (subject) de um token JWT.
   * Retorna null se o token for inválido ou o email estiver ausente.
   */
  public String getEmailFromToken(String token) {
    try {
      if (token == null || token.isEmpty()) {
        System.out.println("Token está nulo ou vazio");
        return null;
      }
      token = token.trim();
      Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
      JWTVerifier verifier = JWT.require(algorithm).build();
      String email = verifier.verify(token).getSubject();
      if (email == null || email.isEmpty()) {
        System.out.println("Email extraído está vazio");
        return null;
      }
      return email;
    } catch (JWTVerificationException e) {
      System.out.println("Erro ao verificar o token: " + e.getMessage());
      return null;
    } catch (Exception e) {
      System.out.println("Erro inesperado ao processar token: " + e.getClass().getName() + " - " + e.getMessage());
      return null;
    }
  }

  /**
   * Verifica a validade de um token JWT.
   * Retorna true se válido, false caso contrário.
   */
  public boolean isTokenValid(String token) {
    try {
      if (token == null || token.isEmpty()) {
        System.out.println("Token está nulo ou vazio");
        return false;
      }
      token = token.trim();
      Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
      JWTVerifier verifier = JWT.require(algorithm).build();
      verifier.verify(token);
      return true;
    } catch (JWTVerificationException e) {
      System.out.println("Token inválido: " + e.getMessage());
      return false;
    } catch (Exception e) {
      System.out.println("Erro inesperado ao validar token: " + e.getClass().getName() + " - " + e.getMessage());
      return false;
    }
  }
}