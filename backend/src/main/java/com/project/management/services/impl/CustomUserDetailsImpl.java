package com.project.management.services.impl;

import com.project.management.models.entities.User;
import com.project.management.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementação customizada do UserDetailsService para integração com Spring Security.
 * Carrega dados do usuário a partir do email para autenticação, convertendo a entidade User do domínio para UserDetails do Spring Security.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsImpl implements UserDetailsService {

  private final UserRepository userRepository;

  /**
   * Carrega os dados do usuário pelo email para autenticação.
   *
   * @param username email do usuário (usado como identificador único)
   * @return objeto UserDetails para uso pelo Spring Security
   * @throws UsernameNotFoundException se o usuário não for encontrado
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username);

    if (user == null) {
      throw new UsernameNotFoundException("não encontramos uma conta com o email: " + username);
    }

    List<GrantedAuthority> authorities = new ArrayList<>();

    return new org.springframework.security.core.userdetails.User(
      user.getEmail(), user.getPassword(), authorities
    );
  }
}