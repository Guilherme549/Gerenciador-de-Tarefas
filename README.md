# Gerenciador de Tarefas

## Descrição

O **Gerenciador de Tarefas** é uma API voltada para o gerenciamento de equipes e tarefas. Com níveis de acesso diferenciados, ela permite a criação de contas, autenticação e organização de atividades, além de funcionalidades como gerenciamento de times, atribuição de tarefas e categorização por status e prioridade.

---

## Funcionalidades

### Autenticação e Autorização
- **Cadastro e Login**:
  - Criação de contas com e-mails únicos.
  - Autenticação via **JWT**.
- **Níveis de Acesso**:
  - **Administrador**: Gerencia usuários, equipes e tarefas.
  - **Membro**: Gerencia apenas tarefas atribuídas.

### Gerenciamento de Times
- Apenas administradores podem:
  - Criar e editar times.
  - Adicionar ou remover membros de equipes.

### Tarefas
- **CRUD completo**:
  - Criar, visualizar, atualizar e deletar tarefas.
- **Categorização**:
  - Status: `Pendente`, `Em progresso`, `Concluído`.
  - Prioridade: `Alta`, `Média`, `Baixa`.
- **Atribuição de Tarefas**:
  - Associar tarefas a membros específicos.
  - Exibição de tarefas por equipe.

### Atribuições por Nível de Acesso
- **Usuários Administradores**:
  - Gerenciar todas as tarefas, usuários e equipes.
- **Usuários Membros**:
  - Visualizar tarefas do time.
  - Editar apenas suas próprias tarefas.

---

## Tecnologias e Recursos

- **Backend**: Node.js
  - Framework: Express.js
  - Validação: Zod
  - Autenticação: JWT
- **Banco de Dados**: PostgreSQL
  - ORM: Prisma
- **Testes**:
  - Framework: Jest
- **Deploy**:
  - Plataforma: Render
- **Outros**:
  - Docker
  - TypeScript

---

## Estrutura de Banco de Dados

### Tabelas Principais

#### `users`
| Campo       | Tipo          | Descrição                        |
|-------------|---------------|----------------------------------|
| `id`        | INTEGER       | Identificador único (PK).        |
| `name`      | VARCHAR(100)  | Nome do usuário.                 |
| `email`     | VARCHAR(150)  | E-mail único do usuário.         |
| `password`  | VARCHAR(255)  | Senha criptografada.             |
| `role`      | ENUM          | Nível de acesso (admin/member).  |
| `created_at`| TIMESTAMP     | Data de criação.                 |
| `updated_at`| TIMESTAMP     | Data de última atualização.      |

#### `teams`
| Campo       | Tipo          | Descrição                        |
|-------------|---------------|----------------------------------|
| `id`        | INTEGER       | Identificador único (PK).        |
| `name`      | VARCHAR(100)  | Nome do time.                    |
| `description`| TEXT         | Descrição do time (opcional).    |
| `created_at`| TIMESTAMP     | Data de criação.                 |
| `updated_at`| TIMESTAMP     | Data de última atualização.      |

#### `team_members`
| Campo       | Tipo          | Descrição                        |
|-------------|---------------|----------------------------------|
| `id`        | INTEGER       | Identificador único (PK).        |
| `user_id`   | INTEGER       | FK para `users.id`.              |
| `team_id`   | INTEGER       | FK para `teams.id`.              |
| `created_at`| TIMESTAMP     | Data de criação.                 |

#### `tasks`
| Campo       | Tipo          | Descrição                        |
|-------------|---------------|----------------------------------|
| `id`        | INTEGER       | Identificador único (PK).        |
| `title`     | VARCHAR(200)  | Título da tarefa.                |
| `description`| TEXT         | Descrição da tarefa.             |
| `status`    | ENUM          | Status (pending/in_progress/completed). |
| `priority`  | ENUM          | Prioridade (high/medium/low).    |
| `assigned_to`| INTEGER      | FK para `users.id`.              |
| `team_id`   | INTEGER       | FK para `teams.id`.              |
| `created_at`| TIMESTAMP     | Data de criação.                 |
| `updated_at`| TIMESTAMP     | Data de última atualização.      |

#### `task_history` (opcional)
| Campo       | Tipo          | Descrição                        |
|-------------|---------------|----------------------------------|
| `id`        | INTEGER       | Identificador único (PK).        |
| `task_id`   | INTEGER       | FK para `tasks.id`.              |
| `changed_by`| INTEGER       | FK para `users.id`.              |
| `old_status`| ENUM          | Status anterior.                 |
| `new_status`| ENUM          | Novo status.                     |
| `changed_at`| TIMESTAMP     | Data da mudança.                 |

---

## Rotas da Aplicação

### Usuários
- **Criar Usuário**: `POST http://localhost:3333/users`
- **Listar Usuários**: `GET http://localhost:3333/users`
- **Login com JWT**: `POST http://localhost:3333/sessions`

### Times
- **Criar Time (Admin)**: `POST http://localhost:3333/teams`
- **Listar Times**: `GET http://localhost:3333/teams`
- **Listar Pessoas em um Time**: `GET http://localhost:3333/teams-member`
- **Adicionar Pessoa em um Time**: `POST http://localhost:3333/teams-member`

### Tarefas
- **Criar Tarefa**: `POST http://localhost:3333/tasks`
- **Listar Tarefas**: `GET http://localhost:3333/tasks`
- **Editar Tarefa**: `PUT http://localhost:3333/tasks/:id`
- **Deletar Tarefa**: `DELETE http://localhost:3333/tasks/:id/delete`

---

## Configuração e Execução Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/Guilherme549/Gerenciador-de-Tarefas.git
   cd Gerenciador-de-Tarefas

npm i

docker compose up

npx prisma migrate dev

