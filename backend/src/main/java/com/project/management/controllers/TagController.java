package com.project.management.controllers;

import com.project.management.models.entities.Tag;
import com.project.management.models.entities.User;
import com.project.management.repositories.ProjectRepository;
import com.project.management.repositories.TagRepository;
import com.project.management.response.MessageResponse;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelos endpoints de gerenciamento de tags.
 * Fornece operações CRUD para tags personalizadas dos usuários e autenticação JWT.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tags")
public class TagController {

  private final TagRepository tagRepository;
  private final UserService userService;
  private final ProjectRepository projectRepository;

  /**
   * Cria uma nova tag personalizada para o usuário autenticado.
   *
   * @param tag dados da tag a ser criada
   * @param jwt token JWT para autenticação do usuário
   * @return tag criada com o usuário como proprietário
   * @throws Exception se dados inválidos ou erro na autenticação
   */
  @PostMapping
  public ResponseEntity<Tag> createTag(@RequestBody Tag tag, @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    tag.setOwner(user);

    Tag createdTag = tagRepository.save(tag);
    return new ResponseEntity<>(createdTag, HttpStatus.CREATED);
  }

  /**
   * Recupera todas as tags pertencentes ao usuário autenticado.
   *
   * @param jwt token JWT para autenticação do usuário
   * @return lista de tags do usuário ou lista vazia se não houver tags
   * @throws Exception se erro na autenticação
   */
  @GetMapping
  public ResponseEntity<List<Tag>> getUserTags(@RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);

    List<Tag> tags = tagRepository.findByOwner(user);
    return new ResponseEntity<>(tags, HttpStatus.OK);
  }

  /**
   * Atualiza uma tag específica do usuário autenticado.
   *
   * @param id         identificador da tag a ser atualizada
   * @param updatedTag dados atualizados da tag
   * @param jwt        token JWT para autenticação do usuário
   * @return tag atualizada ou erro se não encontrada/sem permissão
   * @throws Exception se tag não existir ou usuário não ser o proprietário
   */
  @PutMapping("/{id}")
  public ResponseEntity<Tag> updateTag(
    @PathVariable Long id,
    @RequestBody Tag updatedTag,
    @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);
    Optional<Tag> optionalTag = tagRepository.findById(id);

    if (optionalTag.isEmpty()) {
      throw new Exception("Tag não encontrada");
    }

    Tag tag = optionalTag.get();

    if (!tag.getOwner().getId().equals(user.getId())) {
      throw new Exception("Você não tem permissão para editar esta tag");
    }

    tag.setName(updatedTag.getName());

    Tag savedTag = tagRepository.save(tag);
    return new ResponseEntity<>(savedTag, HttpStatus.OK);
  }

  /**
   * Remove uma tag específica do usuário autenticado.
   *
   * @param id  identificador da tag a ser removida
   * @param jwt token JWT para autenticação do usuário
   * @return resposta vazia com status 204 (No Content) se removida com sucesso
   * @throws Exception se tag não existir ou usuário não ser o proprietário
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteTag(
    @PathVariable Long id,
    @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserProfileByJwt(jwt);
    Optional<Tag> optionalTag = tagRepository.findById(id);

    if (optionalTag.isEmpty()) {
      throw new Exception("Tag não encontrada");
    }

    Tag tag = optionalTag.get();

    if (!tag.getOwner().getId().equals(user.getId())) {
      throw new Exception("Você não tem permissão para deletar esta tag");
    }

    if (projectRepository.existsByTagsId(id)) {
      return new ResponseEntity<>(
        new MessageResponse("Esta tag está sendo usada em um ou mais projetos. Remova-a dos projetos antes de deletar."),
        HttpStatus.BAD_REQUEST
      );
    }

    tagRepository.delete(tag);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}