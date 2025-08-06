package com.project.management.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Classe de configuração para segurança da aplicação.
 * Define a cadeia de filtros de segurança, configuração CORS e codificador de senhas.
 */
@Configuration
@EnableWebSecurity
public class AppConfig {
  private final JwtTokenValidator jwtTokenValidator;

  public AppConfig(JwtTokenValidator jwtTokenValidator) {
    this.jwtTokenValidator = jwtTokenValidator;
  }

  /**
   * Configura a cadeia de filtros de segurança.
   * - Utiliza gerenciamento de sessões sem estado (stateless).
   * - Restringe endpoints "/api/**" a usuários autenticados.
   * - Permite todas as demais requisições.
   * - Integra filtro de validação JWT.
   * - Desativa CSRF para compatibilidade com APIs REST.
   * - Aplica configuração CORS personalizada.
   */
  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(authorize -> authorize.requestMatchers("/api/**").authenticated().anyRequest().permitAll())
      .addFilterBefore(jwtTokenValidator, BasicAuthenticationFilter.class)
      .csrf(AbstractHttpConfigurer::disable)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()));
    return http.build();
  }

  /**
   * Fornece a configuração de origem CORS.
   * Permite origens específicas, métodos e cabeçalhos para requisições cross-origin.
   */
  private CorsConfigurationSource corsConfigurationSource() {
    return new CorsConfigurationSource() {
      @Override
      public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.asList(
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:4200"
        ));
        cfg.setAllowedMethods(Collections.singletonList("*"));
        cfg.setAllowCredentials(true);
        cfg.setAllowedHeaders(Collections.singletonList("*"));
        cfg.setExposedHeaders(List.of("Authentication"));
        cfg.setMaxAge(3600L);
        return cfg;
      }
    };
  }

  /**
   * Fornece um codificador de senhas baseado em BCrypt para hash seguro de senhas.
   */
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}