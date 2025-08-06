package com.project.management.config;

import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Classe de configuração para constantes relacionadas a JWT.
 * Fornece o algoritmo de assinatura para operações JWT.
 */
@Configuration
public class JwtConstant {
  @Value("${jwt.secret}")
  private String secretKey;

  /**
   * Retorna o algoritmo HMAC256 inicializado com a chave secreta.
   */
  @Bean
  public Algorithm algorithm() {
    return Algorithm.HMAC256(secretKey);
  }
}