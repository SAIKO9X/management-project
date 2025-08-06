package com.project.management.repositories;

import com.project.management.models.entities.Tag;
import com.project.management.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
  List<Tag> findByOwner(User owner);

  List<Tag> findByOwnerAndNameIn(User owner, List<String> names);
}