package com.project.management.services.impl;

import com.project.management.config.JwtProvider;
import com.project.management.models.entities.User;
import com.project.management.repositories.UserRepository;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementação do serviço para gerenciamento de usuários.
 * Fornece operações para busca, atualização de perfil e manipulação de dados de usuário.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;
  private final PasswordEncoder passwordEncoder;

  /**
   * Recupera o perfil de um usuário com base em um token JWT.
   *
   * @param jwt Token JWT contendo informações do usuário
   * @return Entidade do usuário correspondente
   * @throws Exception Se o token for inválido ou o usuário não for encontrado
   */
  @Override
  public User findUserProfileByJwt(String jwt) throws Exception {
    String token = jwt.startsWith("Bearer ") ? jwt.substring(7).trim() : jwt;
    String email = jwtProvider.getEmailFromToken(token);
    if (email == null || email.isEmpty()) {
      throw new Exception("Email não fornecido ou token inválido");
    }
    return findUserByEmail(email);
  }

  /**
   * Recupera um usuário pelo endereço de email.
   *
   * @param email Email do usuário
   * @return Entidade do usuário correspondente
   * @throws Exception Se o email for inválido ou o usuário não for encontrado
   */
  @Override
  public User findUserByEmail(String email) throws Exception {
    if (email == null || email.isEmpty()) {
      throw new Exception("Email não fornecido ou token inválido");
    }
    String normalizedEmail = email.trim().toLowerCase();
    User user = userRepository.findByEmailIgnoreCase(normalizedEmail);
    if (user == null) {
      throw new Exception("Usuário não encontrado");
    }
    return user;
  }

  /**
   * Recupera um usuário pelo seu ID.
   *
   * @param userId ID do usuário
   * @return Entidade do usuário correspondente
   * @throws Exception Se o usuário não for encontrado
   */
  @Override
  public User findUserById(Long userId) throws Exception {
    Optional<User> optionalUser = userRepository.findById(userId);
    if (optionalUser.isEmpty()) {
      throw new Exception("Usuário não encontrado");
    }
    return optionalUser.get();
  }

  /**
   * Atualiza o tamanho do projeto associado a um usuário.
   *
   * @param user   Usuário a ser atualizado
   * @param number Incremento ou decremento no tamanho do projeto
   * @return Entidade do usuário atualizada
   * @throws Exception Se ocorrer erro na persistência
   */
  @Override
  public User updateUsersProjectSize(User user, int number) throws Exception {
    user.setProjectSize(user.getProjectSize() + number);
    return userRepository.save(user);
  }

  /**
   * Atualiza o perfil de um usuário, incluindo nome, foto e senha.
   *
   * @param jwt             Token JWT para autenticação
   * @param updatedUser     Dados atualizados do usuário
   * @param profilePicture  Arquivo de imagem para foto de perfil
   * @param currentPassword Senha atual para validação
   * @return Entidade do usuário atualizada
   * @throws Exception Se a senha atual for incorreta ou ocorrer erro no upload
   */
  @Override
  public User updateUserProfile(String jwt, User updatedUser, MultipartFile profilePicture, String currentPassword) throws Exception {
    User user = findUserProfileByJwt(jwt);

    if (updatedUser.getFullName() != null && !updatedUser.getFullName().isEmpty()) {
      user.setFullName(updatedUser.getFullName());
    }

    if (profilePicture != null && !profilePicture.isEmpty()) {
      String fileName = UUID.randomUUID().toString() + "_" + profilePicture.getOriginalFilename();
      Path filePath = Paths.get("./uploads", fileName);
      Files.createDirectories(filePath.getParent());
      Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
      user.setProfilePicture("/uploads/" + fileName);
    }

    if (currentPassword != null && !currentPassword.isEmpty()) {
      if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
        throw new Exception("Senha atual incorreta");
      }
      if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
      }
    }

    return userRepository.save(user);
  }
}