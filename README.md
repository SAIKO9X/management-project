---
# 📁 Sistema de Gerenciamento de Projetos

Este é um sistema completo para gerenciamento de projetos, desenvolvido com **Spring Boot** no backend e **React** no frontend. Ele oferece funcionalidades como autenticação de usuários, criação e gerenciamento de projetos, issues, chat em tempo real, envio de convites por email e muito mais. O banco de dados **MySQL** é configurado para rodar via **Docker**, facilitando a execução do projeto.
---

## 📽️ Demonstração

- 📷 Veja imagens do projeto em ação:

  <table align="center">
  <tr>
    <td align="center">
      <p><strong>Detalhes do Projeto</strong></p>
      <img src="https://raw.githubusercontent.com/SAIKO9X/management-project/main/screenshots/image.png" alt="Detalhes do Projeto" width="400"/>
    </td>
    <td align="center">
      <p><strong>Controle de Tasks</strong></p>
      <img src="https://raw.githubusercontent.com/SAIKO9X/management-project/main/screenshots/image2.png" alt="Controle de Tasks" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <p><strong>Página de uma Issue</strong></p>
      <img src="https://raw.githubusercontent.com/SAIKO9X/management-project/main/screenshots/image3.png" alt="Página de uma Issue" width="400"/>
    </td>
    <td align="center">
      <p><strong>Home Screen</strong></p>
      <img src="https://raw.githubusercontent.com/SAIKO9X/management-project/main/screenshots/image4.png" alt="Home Screen" width="400"/>
    </td>
  </tr>
</table>

---

## ✅ Funcionalidades

- 🔐 Autenticação de usuários (login, registro, recuperação de senha)
- 📁 Gerenciamento de projetos (criação, edição, exclusão)
- 🐞 Criação e acompanhamento de _issues_ com prioridades e status
- 💬 Chat em tempo real entre membros do projeto
- ✉️ Envio de convites por email
- 🏷️ Suporte a categorias e tags personalizadas

---

## ⚙️ Pré-requisitos

- [Java 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [PNPM](https://pnpm.io/)
- Conta de email para envio de notificações (ex.: Gmail)

---

## 🚀 Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/project-management.git
cd project-management
```

### 2. Configurar o Banco de Dados via Docker

Crie um arquivo `.env` na raiz do projeto com as variáveis:

```env
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
```

Inicie o container MySQL:

```bash
docker-compose up -d db
```

### 3. Configurar o Backend

```bash
cd backend
cp application.properties.example application.properties
```

Edite `application.properties` com suas credenciais:

```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua_senha_de_app
```

### 4. Configurar o Frontend

```bash
cd ../frontend
pnpm install
```

---

## ▶️ Executando o Projeto

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
pnpm run dev
```

---

## 🌐 Acessando o Projeto

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:8080](http://localhost:8080)

---

## 📝 Notas

- Use uma **senha de aplicativo** para o Gmail, se necessário.
  [Veja como criar uma senha de app no Gmail](https://support.google.com/accounts/answer/185833)

- O **MySQL** roda na **porta 3307** por padrão via Docker.

---

## 🧰 Tecnologias Utilizadas

### Backend

- Spring Boot
- JPA / Hibernate
- Spring Security
- JWT (JSON Web Token)
- MySQL

### Frontend

- React
- Redux
- PNPM
- Tailwind CSS

### Infraestrutura

- Docker

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---
