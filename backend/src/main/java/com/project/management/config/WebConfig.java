package com.project.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configura ajustes web para servir recursos estáticos.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  /**
   * Mapeia requisições "/uploads/**" para o diretório "./uploads/" para servir arquivos estáticos.
   */
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**").addResourceLocations("file:./uploads/");
  }
}