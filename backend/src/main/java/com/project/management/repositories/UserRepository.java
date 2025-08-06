package com.project.management.repositories;

import com.project.management.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  User findByEmail(String email);

  User findByEmailIgnoreCase(String email);
}
