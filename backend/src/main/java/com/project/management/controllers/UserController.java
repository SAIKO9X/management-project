package com.project.management.controllers;

import com.project.management.models.entities.User;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controller responsável pelos endpoints de gerenciamento de perfil do usuário.
 * Fornece operações para visualização e atualização dos dados pessoais, incluindo alteração de senha e upload de foto de perfil.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  /**
   * Recupera o perfil completo do usuário autenticado.
   *
   * @param jwt token JWT para autenticação do usuário
   * @return dados completos do perfil do usuário
   * @throws Exception se token inválido ou usuário não encontrado
   */
  @GetMapping("/profile")
  public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  /**
   * Atualiza os dados do perfil do usuário autenticado.
   * Permite atualização seletiva de nome completo, senha e foto de perfil.
   * Para alteração de senha, é obrigatório fornecer a senha atual para validação.
   *
   * @param jwt             token JWT para autenticação do usuário
   * @param fullName        novo nome completo (opcional)
   * @param currentPassword senha atual para validação de alteração de senha (opcional)
   * @param newPassword     nova senha do usuário (opcional, requer currentPassword)
   * @param profilePicture  nova foto de perfil (opcional)
   * @return perfil do usuário atualizado
   * @throws Exception se senha atual incorreta, dados inválidos ou erro no upload
   */
  @PutMapping("/profile")
  public ResponseEntity<User> updateUserProfile(
    @RequestHeader("Authorization") String jwt,
    @RequestPart(value = "fullName", required = false) String fullName,
    @RequestPart(value = "currentPassword", required = false) String currentPassword,
    @RequestPart(value = "newPassword", required = false) String newPassword,
    @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture
  ) throws Exception {

    User updatedUser = new User();

    if (fullName != null && !fullName.isEmpty()) {
      updatedUser.setFullName(fullName);
    }

    if (newPassword != null && !newPassword.isEmpty()) {
      updatedUser.setPassword(newPassword);
    }

    User updated = userService.updateUserProfile(jwt, updatedUser, profilePicture, currentPassword);
    return new ResponseEntity<>(updated, HttpStatus.OK);
  }
}