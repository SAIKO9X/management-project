package com.project.management.services;

import com.project.management.models.entities.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
  User findUserProfileByJwt(String jwt) throws Exception;

  User findUserByEmail(String email) throws Exception;

  User findUserById(Long userId) throws Exception;

  User updateUsersProjectSize(User user, int number) throws Exception;

  User updateUserProfile(String jwt, User updatedUser, MultipartFile profilePicture, String currentPassword) throws Exception;
}
