package com.project.management.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro que valida tokens JWT a partir do cabeçalho Authorization.
 * Define autenticação no SecurityContext se o token for válido.
 */
@Component
public class JwtTokenValidator extends OncePerRequestFilter {

  private final JwtProvider jwtProvider;

  public JwtTokenValidator(JwtProvider jwtProvider) {
    this.jwtProvider = jwtProvider;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String header = request.getHeader("Authorization");

    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7).trim();

      // Valida formato e autenticidade do token
      if (token.isEmpty() || !isValidJwtFormat(token)) {
        System.out.println("Token malformado: " + token);
        SecurityContextHolder.clearContext();
      } else if (jwtProvider.isTokenValid(token)) {
        String email = jwtProvider.getEmailFromToken(token);

        if (email != null && !email.isEmpty()) {
          // Extrai e aplica permissões
          String authorities;
          try {
            DecodedJWT decodedJWT = JWT.decode(token);
            authorities = decodedJWT.getClaim("authorities").asString();
            if (authorities == null) authorities = "";
          } catch (JWTDecodeException e) {
            System.out.println("Erro ao decodificar claims do token: " + e.getMessage());
            authorities = "";
          }

          List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
          Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);
          SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
          System.out.println("Email não encontrado no token");
          SecurityContextHolder.clearContext();
        }
      } else {
        System.out.println("Token inválido ou expirado");
        SecurityContextHolder.clearContext();
      }
    } else {
      System.out.println("Nenhum token Bearer encontrado no header Authorization");
    }

    filterChain.doFilter(request, response);
  }

  /**
   * Verifica se o token segue o formato JWT (três partes separadas por pontos).
   */
  private boolean isValidJwtFormat(String token) {
    String[] parts = token.split("\\.");
    return parts.length == 3 && !parts[0].isEmpty() && !parts[1].isEmpty() && !parts[2].isEmpty();
  }
}