# Documentação dos Contexts

## Visão Geral

Os contexts do React são utilizados para gerenciar o estado global da aplicação, permitindo compartilhar dados entre componentes sem a necessidade de prop drilling. O projeto Vylex utiliza dois contexts principais: `AuthContext` e `TaskContext`.

## AuthContext

### Localização

`src/contexts/auth-context.tsx`

### Propósito

Gerencia o estado de autenticação da aplicação, incluindo login, registro, logout e verificação de tokens.

### Funcionalidades

#### Estados Gerenciados

- `user`: Usuário atual logado (User | null)
- `isAuthenticated`: Status de autenticação (boolean)
- `isLoading`: Estado de carregamento (boolean)

#### Métodos Disponíveis

##### `login(credentials: LoginCredentials): Promise<AuthResult>`

Realiza o login do usuário com email e senha.

**Parâmetros:**

- `credentials`: Objeto contendo email e senha

**Retorno:**

- `AuthResult`: Resultado da operação com sucesso/erro e dados do usuário

**Exemplo:**

```typescript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login({
    email: "usuario@exemplo.com",
    password: "senha123",
  });

  if (result.success) {
    // Login bem-sucedido
  }
};
```

##### `register(data: RegisterData): Promise<AuthResult>`

Registra um novo usuário no sistema.

**Parâmetros:**

- `data`: Objeto contendo nome, email e senha

**Retorno:**

- `AuthResult`: Resultado da operação

##### `logout(): Promise<void>`

Realiza logout do usuário, limpando dados de autenticação.

##### `refreshToken(): Promise<boolean>`

Renova o token de autenticação.

**Retorno:**

- `boolean`: Indica se a renovação foi bem-sucedida

### Hook de Uso

```typescript
import { useAuth } from "@/contexts/auth-context";

function MeuComponente() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // Usar os dados e métodos aqui
}
```

### Inicialização

O contexto é inicializado automaticamente no `RootLayout` e inclui:

- Migração de tokens antigos
- Limpeza de tokens inválidos
- Verificação automática de autenticação ao carregar a aplicação

## TaskContext

### Localização

`src/contexts/task-context.tsx`

### Propósito

Gerencia o estado das tarefas da aplicação, incluindo operações CRUD e consultas.

### Funcionalidades

#### Estados Gerenciados

- `tasks`: Lista de tarefas do usuário (Task[])
- `isLoading`: Estado de carregamento (boolean)
- `error`: Mensagem de erro (string | null)

#### Métodos CRUD

##### `createTask(data: CreateTaskData): Promise<Task>`

Cria uma nova tarefa.

**Parâmetros:**

- `data`: Dados da tarefa a ser criada

**Retorno:**

- `Task`: Tarefa criada

**Exemplo:**

```typescript
const { createTask } = useTasks();

const handleCreateTask = async () => {
  try {
    const newTask = await createTask({
      title: "Nova Tarefa",
      description: "Descrição da tarefa",
      status: "pending",
      dueDate: new Date(),
      priority: "medium",
      tags: ["trabalho"],
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
  }
};
```

##### `updateTask(id: string, updates: UpdateTaskData): Promise<Task | null>`

Atualiza uma tarefa existente.

**Parâmetros:**

- `id`: ID da tarefa
- `updates`: Dados a serem atualizados

**Retorno:**

- `Task | null`: Tarefa atualizada ou null se não encontrada

##### `deleteTask(id: string): Promise<boolean>`

Exclui uma tarefa.

**Parâmetros:**

- `id`: ID da tarefa

**Retorno:**

- `boolean`: Indica se a exclusão foi bem-sucedida

#### Métodos de Consulta

##### `getTaskById(id: string): Task | null`

Busca uma tarefa por ID.

##### `getTasksByStatus(status: TaskStatus): Task[]`

Filtra tarefas por status.

##### `getTasksByUserId(userId: string): Task[]`

Busca todas as tarefas de um usuário.

##### `getFilteredTasks(filters: TaskFilters, sort?: TaskSortOptions): Task[]`

Aplica filtros e ordenação às tarefas.

**Parâmetros:**

- `filters`: Objeto com critérios de filtro
- `sort`: Opções de ordenação (opcional)

**Exemplo:**

```typescript
const { getFilteredTasks } = useTasks();

const filteredTasks = getFilteredTasks(
  {
    status: "pending",
    priority: "high",
    searchTerm: "importante",
  },
  {
    field: "dueDate",
    order: "asc",
  }
);
```

##### `getTaskStatistics(userId: string): TaskStatistics`

Retorna estatísticas das tarefas do usuário.

**Retorno:**

- `TaskStatistics`: Objeto com contadores e métricas

### Hook de Uso

```typescript
import { useTasks } from "@/contexts/task-context";

function MeuComponente() {
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } =
    useTasks();

  // Usar os dados e métodos aqui
}
```

### Inicialização

O contexto é inicializado automaticamente quando um usuário está autenticado e carrega suas tarefas do serviço.

## Integração entre Contexts

Os contexts trabalham em conjunto:

1. `AuthContext` gerencia a autenticação
2. `TaskContext` depende do usuário autenticado para carregar tarefas
3. Ambos são fornecidos no `RootLayout` da aplicação

## Tratamento de Erros

Ambos os contexts incluem tratamento robusto de erros:

- Estados de erro específicos
- Logs detalhados para debugging
- Limpeza automática de dados inválidos
- Fallbacks para cenários de falha

## Considerações de Performance

- Uso de `useCallback` para evitar re-renderizações desnecessárias
- Estados de loading para melhor UX
- Carregamento lazy de dados quando necessário
- Limpeza automática de recursos
