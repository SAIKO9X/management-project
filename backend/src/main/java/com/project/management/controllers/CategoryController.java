package com.project.management.controllers;

import com.project.management.models.entities.Category;
import com.project.management.models.entities.User;
import com.project.management.repositories.CategoryRepository;
import com.project.management.repositories.ProjectRepository;
import com.project.management.response.MessageResponse;
import com.project.management.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para gerenciamento de categorias.
 * Fornece endpoints para operações CRUD de categorias com validação de autorização baseada em JWT.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryRepository categoryRepository;
  private final UserService userService;
  private final ProjectRepository projectRepository;

  /**
   * Cria uma nova categoria para o usuário autenticado.
   * O usuário é automaticamente definido como proprietário da categoria criada.
   *
   * @param category dados da categoria a ser criada
   * @param jwt      token JWT para autenticação do usuário
   * @return ResponseEntity contendo a categoria criada com status HTTP 201 (CREATED)
   * @throws Exception se houver erro na autenticação do usuário ou validação dos dados
   */
  @PostMapping
  public ResponseEntity<Category> createCategory(@RequestBody Category category, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    category.setOwner(user);
    Category createdCategory = categoryRepository.save(category);
    return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
  }

  /**
   * Recupera todas as categorias pertencentes ao usuário autenticado.
   *
   * @param jwt token JWT para autenticação do usuário
   * @return ResponseEntity contendo a lista de categorias do usuário com status HTTP 200 (OK)
   * @throws Exception se houver erro na autenticação do usuário
   */
  @GetMapping
  public ResponseEntity<List<Category>> getUserCategories(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    List<Category> categories = categoryRepository.findByOwner(user);
    return new ResponseEntity<>(categories, HttpStatus.OK);
  }

  /**
   * Atualiza uma categoria existente com validação de autorização.
   * Apenas o proprietário da categoria pode realizar a atualização.
   *
   * @param id              ID da categoria a ser atualizada
   * @param updatedCategory dados atualizados da categoria
   * @param jwt             token JWT para autenticação do usuário
   * @return ResponseEntity contendo a categoria atualizada com status HTTP 200 (OK)
   * @throws Exception se a categoria não for encontrada, usuário não autenticado ou sem permissão
   */
  @PutMapping("/{id}")
  public ResponseEntity<Category> updateCategory(
    @PathVariable Long id,
    @RequestBody Category updatedCategory,
    @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    Optional<Category> optionalCategory = categoryRepository.findById(id);

    if (optionalCategory.isEmpty()) {
      throw new Exception("Categoria não encontrada");
    }

    Category category = optionalCategory.get();
    if (!category.getOwner().getId().equals(user.getId())) {
      throw new Exception("Você não tem permissão para editar esta categoria");
    }

    category.setName(updatedCategory.getName());
    Category savedCategory = categoryRepository.save(category);
    return new ResponseEntity<>(savedCategory, HttpStatus.OK);
  }

  /**
   * Exclui uma categoria existente com validação de autorização.
   * Apenas o proprietário da categoria pode realizar a exclusão.
   *
   * @param id  ID da categoria a ser excluída
   * @param jwt token JWT para autenticação do usuário
   * @return ResponseEntity vazio com status HTTP 204 (NO_CONTENT) indicando sucesso na exclusão
   * @throws Exception se a categoria não for encontrada, usuário não autenticado ou sem permissão
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteCategory(
    @PathVariable Long id,
    @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    Optional<Category> optionalCategory = categoryRepository.findById(id);

    if (optionalCategory.isEmpty()) {
      throw new Exception("Categoria não encontrada");
    }

    Category category = optionalCategory.get();
    if (!category.getOwner().getId().equals(user.getId())) {
      throw new Exception("Você não tem permissão para deletar esta categoria");
    }

    if (projectRepository.existsByCategoryId(id)) {
      return new ResponseEntity<>(
        new MessageResponse("Esta categoria está sendo usada em um ou mais projetos. Remova-a dos projetos antes de deletar."),
        HttpStatus.BAD_REQUEST
      );
    }

    categoryRepository.delete(category);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}