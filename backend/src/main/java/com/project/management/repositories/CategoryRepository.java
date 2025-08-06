package com.project.management.repositories;

import com.project.management.models.entities.Category;
import com.project.management.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
  List<Category> findByOwner(User owner);

  Optional<Category> findByNameAndOwner(String name, User owner);
}