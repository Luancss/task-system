# Documentação dos Types

## Visão Geral

O arquivo de tipos centraliza todas as definições de interface TypeScript do projeto, garantindo consistência e type safety em toda a aplicação. As definições são organizadas por funcionalidade e seguem convenções claras.

## Estrutura do Arquivo

### Localização

`src/types/index.ts`

### Organização

- **Entidades principais**: User, Task
- **Tipos de autenticação**: LoginCredentials, RegisterData, AuthResult
- **Tipos de tarefas**: CreateTaskData, UpdateTaskData, TaskFilters
- **Tipos de contexto**: AuthContextType, TaskContextType
- **Tipos de formulário**: CreateTaskForm, UpdateTaskForm
- **Tipos de API**: ApiResponse, PaginatedResponse
- **Tipos de erro**: AppError, ErrorType
- **Tipos utilitários**: Optional, RequiredFields

## Entidades Principais

### User

```typescript
export interface User {
  readonly id: string;
  name: string;
  email: string;
  passwordHash: string;
  readonly createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}
```

**Propriedades:**

- `id`: Identificador único (readonly)
- `name`: Nome completo do usuário
- `email`: Email único do usuário
- `passwordHash`: Hash da senha (nunca exposto)
- `createdAt`: Data de criação (readonly)
- `updatedAt`: Data da última atualização (opcional)
- `isActive`: Status de ativação da conta

**Características:**

- Campos readonly para dados imutáveis
- PasswordHash nunca é retornado em respostas
- Email é único no sistema
- Timestamps automáticos

### Task

```typescript
export interface Task {
  readonly id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  readonly userId: string;
  readonly createdAt: Date;
  updatedAt: Date;
  priority: TaskPriority;
  tags?: string[];
}
```

**Propriedades:**

- `id`: Identificador único (readonly)
- `title`: Título da tarefa
- `description`: Descrição detalhada
- `status`: Status atual da tarefa
- `dueDate`: Data de vencimento
- `userId`: ID do proprietário (readonly)
- `createdAt`: Data de criação (readonly)
- `updatedAt`: Data da última atualização
- `priority`: Nível de prioridade
- `tags`: Tags opcionais para categorização

**Características:**

- Relacionamento com User através de userId
- Timestamps automáticos
- Tags opcionais para organização
- Status e prioridade com valores específicos

## Tipos de Enum

### TaskStatus

```typescript
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
```

**Valores:**

- `pending`: Tarefa criada, aguardando início
- `in_progress`: Tarefa em andamento
- `completed`: Tarefa finalizada
- `cancelled`: Tarefa cancelada

### TaskPriority

```typescript
export type TaskPriority = "low" | "medium" | "high" | "urgent";
```

**Valores:**

- `low`: Prioridade baixa
- `medium`: Prioridade média (padrão)
- `high`: Prioridade alta
- `urgent`: Prioridade urgente

## Tipos de Autenticação

### LoginCredentials

```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}
```

**Uso:**

```typescript
const credentials: LoginCredentials = {
  email: "usuario@exemplo.com",
  password: "senha123",
};
```

### RegisterData

```typescript
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
```

**Validações:**

- Nome: mínimo 2 caracteres
- Email: formato válido
- Senha: mínimo 6 caracteres

### AuthResult

```typescript
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}
```

**Casos de Uso:**

```typescript
// Sucesso
const result: AuthResult = {
  success: true,
  user: { id: "123", name: "João", email: "joao@exemplo.com", ... }
};

// Erro
const result: AuthResult = {
  success: false,
  error: "Email ou senha incorretos"
};
```

## Tipos de Tarefas

### CreateTaskData

```typescript
export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  priority: TaskPriority;
  tags?: string[];
}
```

**Diferenças do Task:**

- Sem `id` (gerado automaticamente)
- Sem `userId` (adicionado pelo service)
- Sem timestamps (gerados automaticamente)
- Tags opcionais

### UpdateTaskData

```typescript
export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
  priority?: TaskPriority;
  tags?: string[];
}
```

**Características:**

- Todos os campos opcionais
- Permite atualizações parciais
- Validação no service

### TaskFilters

```typescript
export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  searchTerm?: string;
  dueDateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}
```

**Filtros Disponíveis:**

- **Status**: Filtro por status específico ou "all"
- **Prioridade**: Filtro por prioridade ou "all"
- **Busca**: Termo de busca em título, descrição e tags
- **Data**: Range de datas de vencimento
- **Tags**: Filtro por tags específicas

**Exemplo:**

```typescript
const filters: TaskFilters = {
  status: "pending",
  priority: "high",
  searchTerm: "importante",
  dueDateRange: {
    start: new Date("2024-01-01"),
    end: new Date("2024-12-31"),
  },
  tags: ["trabalho", "urgente"],
};
```

### TaskSortOptions

```typescript
export interface TaskSortOptions {
  field: "title" | "dueDate" | "createdAt" | "priority" | "status";
  order: "asc" | "desc";
}
```

**Campos de Ordenação:**

- `title`: Ordenação alfabética
- `dueDate`: Ordenação por data de vencimento
- `createdAt`: Ordenação por data de criação
- `priority`: Ordenação por prioridade
- `status`: Ordenação por status

### TaskStatistics

```typescript
export interface TaskStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  dueToday: number;
  byPriority: Record<TaskPriority, number>;
}
```

**Métricas:**

- Contadores por status
- Tarefas vencidas
- Tarefas para hoje
- Distribuição por prioridade

## Tipos de Contexto

### AuthContextType

```typescript
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}
```

**Estados:**

- `user`: Usuário atual ou null
- `isAuthenticated`: Status de autenticação
- `isLoading`: Estado de carregamento

**Métodos:**

- `login`: Autenticação do usuário
- `register`: Registro de novo usuário
- `logout`: Encerramento de sessão
- `refreshToken`: Renovação de token

### TaskContextType

```typescript
export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskData) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;

  // Query Operations
  getTaskById: (id: string) => Task | null;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByUserId: (userId: string) => Task[];
  getFilteredTasks: (filters: TaskFilters, sort?: TaskSortOptions) => Task[];

  // Statistics
  getTaskStatistics: (userId: string) => TaskStatistics;
}
```

## Tipos de Formulário

### CreateTaskForm

```typescript
export interface CreateTaskForm {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
  tags: string;
}
```

**Diferenças do CreateTaskData:**

- `dueDate` como string (formato de input)
- `tags` como string (separadas por vírgula)

### UpdateTaskForm

```typescript
export interface UpdateTaskForm {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  tags?: string;
}
```

## Tipos de API

### ApiResponse

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Uso Genérico:**

```typescript
const response: ApiResponse<User> = {
  success: true,
  data: user,
  message: "Usuário criado com sucesso",
};
```

### PaginatedResponse

```typescript
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Exemplo:**

```typescript
const response: PaginatedResponse<Task> = {
  success: true,
  data: tasks,
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
  },
};
```

## Tipos de Erro

### AppError

```typescript
export interface AppError {
  code: string;
  message: string;
  details?: any;
}
```

### ErrorType

```typescript
export type ErrorType =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND_ERROR"
  | "NETWORK_ERROR"
  | "SERVER_ERROR";
```

## Tipos Utilitários

### Optional

```typescript
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

**Uso:**

```typescript
type UserUpdate = Optional<User, "id" | "createdAt">;
// Remove id e createdAt, torna outros campos opcionais
```

### RequiredFields

```typescript
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

**Uso:**

```typescript
type UserWithEmail = RequiredFields<User, "email">;
// Garante que email seja obrigatório
```

## Convenções e Boas Práticas

### Nomenclatura

- **Interfaces**: PascalCase (User, Task)
- **Types**: PascalCase (TaskStatus, TaskPriority)
- **Propriedades**: camelCase (firstName, dueDate)
- **Readonly**: Campos imutáveis marcados como readonly

### Organização

- **Agrupamento**: Por funcionalidade
- **Comentários**: Documentação inline
- **Exports**: Named exports para melhor tree-shaking
- **Reutilização**: Tipos base reutilizados

### Type Safety

- **Strict**: Configuração TypeScript rigorosa
- **Null Safety**: Uso de null/undefined explícito
- **Generics**: Para reutilização de tipos
- **Union Types**: Para valores específicos

### Exemplos de Uso

#### Validação de Tipos

```typescript
function createTask(data: CreateTaskData): Task {
  return {
    id: generateId(),
    ...data,
    userId: getCurrentUserId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
```

#### Type Guards

```typescript
function isTaskStatus(value: string): value is TaskStatus {
  return ["pending", "in_progress", "completed", "cancelled"].includes(value);
}
```

#### Mapeamento de Tipos

```typescript
type TaskFormData = Omit<CreateTaskData, "dueDate"> & {
  dueDate: string;
};
```

## Integração com Outras Camadas

### Services

```typescript
class TaskService {
  createTask(data: CreateTaskData, userId: string): Promise<Task> {}
}
```

### Contexts

```typescript
const TaskContext = createContext<TaskContextType | undefined>(undefined);
```

### Components

```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
```
