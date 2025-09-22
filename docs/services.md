# Documentação dos Services

## Visão Geral

Os services implementam a lógica de negócio da aplicação, fornecendo uma camada de abstração entre os contexts e os repositories. Eles encapsulam operações complexas e garantem consistência nos dados.

## AuthService

### Localização

`src/services/auth.service.ts`

### Propósito

Gerencia todas as operações relacionadas à autenticação de usuários, incluindo login, registro, verificação de tokens e renovação.

### Interface

```typescript
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  verifyToken(token: string): Promise<User | null>;
  refreshToken(token: string): Promise<string | null>;
}
```

### Funcionalidades

#### `login(credentials: LoginCredentials): Promise<AuthResult>`

Autentica um usuário com email e senha.

**Parâmetros:**

- `credentials`: Objeto contendo email e senha

**Retorno:**

- `AuthResult`: Resultado da operação com sucesso/erro e dados do usuário

**Processo:**

1. Busca usuário por email
2. Verifica se o usuário está ativo
3. Valida a senha usando hash
4. Gera token de autenticação
5. Retorna dados do usuário (sem senha)

**Exemplo:**

```typescript
const authService = new AuthService();

const result = await authService.login({
  email: "usuario@exemplo.com",
  password: "senha123",
});

if (result.success) {
  console.log("Usuário logado:", result.user);
} else {
  console.error("Erro no login:", result.error);
}
```

#### `register(data: RegisterData): Promise<AuthResult>`

Registra um novo usuário no sistema.

**Parâmetros:**

- `data`: Objeto contendo nome, email e senha

**Retorno:**

- `AuthResult`: Resultado da operação

**Processo:**

1. Valida formato do email
2. Valida força da senha
3. Verifica se email já existe
4. Cria hash da senha
5. Gera ID único para o usuário
6. Salva usuário na base de dados
7. Gera token de autenticação

**Validações:**

- Email deve ter formato válido
- Senha deve ter pelo menos 6 caracteres
- Email deve ser único no sistema

#### `verifyToken(token: string): Promise<User | null>`

Verifica se um token é válido e retorna o usuário associado.

**Parâmetros:**

- `token`: Token JWT a ser verificado

**Retorno:**

- `User | null`: Usuário associado ao token ou null se inválido

**Processo:**

1. Decodifica e verifica o token
2. Extrai ID do usuário do payload
3. Busca usuário na base de dados
4. Verifica se usuário está ativo
5. Retorna dados do usuário (sem senha)

#### `refreshToken(token: string): Promise<string | null>`

Gera um novo token baseado em um token válido.

**Parâmetros:**

- `token`: Token atual a ser renovado

**Retorno:**

- `string | null`: Novo token ou null se falhar

### Segurança

#### Hash de Senhas

- Utiliza função de hash segura
- Senhas nunca são armazenadas em texto plano
- Verificação usando comparação de hash

#### Tokens JWT

- Tokens assinados digitalmente
- Payload contém ID do usuário e email
- Verificação de integridade automática

#### Validações

- Email formatado corretamente
- Senhas com comprimento mínimo
- Usuários inativos não podem fazer login
- Tokens expirados são rejeitados

### Exemplo de Uso Completo

```typescript
import { AuthService } from "@/services/auth.service";

class AuthManager {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async loginUser(email: string, password: string) {
    const result = await this.authService.login({ email, password });

    if (result.success && result.user) {
      // Salvar token no storage
      localStorage.setItem("authToken", token);
      return result.user;
    }

    throw new Error(result.error);
  }

  async registerUser(name: string, email: string, password: string) {
    const result = await this.authService.register({ name, email, password });

    if (result.success && result.user) {
      return result.user;
    }

    throw new Error(result.error);
  }

  async verifyCurrentToken() {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    return await this.authService.verifyToken(token);
  }
}
```

## TaskService

### Localização

`src/services/task.service.ts`

### Propósito

Gerencia todas as operações relacionadas às tarefas, incluindo CRUD, filtros, ordenação e estatísticas.

### Interface

```typescript
export interface ITaskService {
  createTask(data: CreateTaskData, userId: string): Promise<Task>;
  updateTask(
    id: string,
    updates: UpdateTaskData,
    userId: string
  ): Promise<Task | null>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  getTaskById(id: string, userId: string): Task | null;
  getTasksByUserId(userId: string): Task[];
  getFilteredTasks(
    filters: TaskFilters,
    userId: string,
    sort?: TaskSortOptions
  ): Task[];
  getTaskStatistics(userId: string): TaskStatistics;
}
```

### Funcionalidades CRUD

#### `createTask(data: CreateTaskData, userId: string): Promise<Task>`

Cria uma nova tarefa para o usuário.

**Parâmetros:**

- `data`: Dados da tarefa a ser criada
- `userId`: ID do usuário proprietário

**Retorno:**

- `Task`: Tarefa criada com ID e timestamps

**Processo:**

1. Gera ID único para a tarefa
2. Define timestamps de criação e atualização
3. Aplica valores padrão se não fornecidos
4. Adiciona tarefa à lista
5. Retorna tarefa criada

#### `updateTask(id: string, updates: UpdateTaskData, userId: string): Promise<Task | null>`

Atualiza uma tarefa existente.

**Parâmetros:**

- `id`: ID da tarefa
- `updates`: Dados a serem atualizados
- `userId`: ID do usuário proprietário

**Retorno:**

- `Task | null`: Tarefa atualizada ou null se não encontrada

**Validações:**

- Tarefa deve pertencer ao usuário
- Tarefa deve existir
- Dados são sanitizados (trim)

#### `deleteTask(id: string, userId: string): Promise<boolean>`

Exclui uma tarefa.

**Parâmetros:**

- `id`: ID da tarefa
- `userId`: ID do usuário proprietário

**Retorno:**

- `boolean`: Indica se a exclusão foi bem-sucedida

### Funcionalidades de Consulta

#### `getFilteredTasks(filters: TaskFilters, userId: string, sort?: TaskSortOptions): Task[]`

Aplica filtros e ordenação às tarefas.

**Filtros Disponíveis:**

- **Status**: pending, in_progress, completed, cancelled
- **Prioridade**: low, medium, high, urgent
- **Busca**: Por título, descrição ou tags
- **Data**: Range de datas de vencimento
- **Tags**: Filtro por tags específicas

**Ordenação:**

- **Campos**: title, dueDate, createdAt, priority, status
- **Ordem**: asc (crescente) ou desc (decrescente)

**Exemplo:**

```typescript
const tasks = taskService.getFilteredTasks(
  {
    status: "pending",
    priority: "high",
    searchTerm: "importante",
  },
  userId,
  {
    field: "dueDate",
    order: "asc",
  }
);
```

#### `getTaskStatistics(userId: string): TaskStatistics`

Retorna estatísticas das tarefas do usuário.

**Métricas Incluídas:**

- Total de tarefas
- Contadores por status
- Tarefas vencidas
- Tarefas para hoje
- Distribuição por prioridade

**Exemplo de Retorno:**

```typescript
{
  total: 25,
  pending: 10,
  inProgress: 8,
  completed: 5,
  cancelled: 2,
  overdue: 3,
  dueToday: 2,
  byPriority: {
    low: 5,
    medium: 10,
    high: 7,
    urgent: 3
  }
}
```

### Exemplo de Uso Completo

```typescript
import { TaskService } from "@/services/task.service";

class TaskManager {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createNewTask(userId: string, taskData: CreateTaskData) {
    try {
      const task = await this.taskService.createTask(taskData, userId);
      console.log("Tarefa criada:", task);
      return task;
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      throw error;
    }
  }

  getTasksForDashboard(userId: string) {
    return this.taskService.getFilteredTasks({ status: "all" }, userId, {
      field: "dueDate",
      order: "asc",
    });
  }

  getOverdueTasks(userId: string) {
    const stats = this.taskService.getTaskStatistics(userId);
    return stats.overdue;
  }
}
```

## Padrões e Arquitetura

### Separação de Responsabilidades

- **Services**: Lógica de negócio
- **Repositories**: Acesso a dados
- **Contexts**: Estado da aplicação
- **Types**: Definições de interface

### Tratamento de Erros

- **Try-catch**: Captura de erros
- **Logs detalhados**: Para debugging
- **Mensagens consistentes**: Usando constantes
- **Fallbacks**: Valores padrão em caso de erro

### Validação de Dados

- **Sanitização**: Trim de strings
- **Validação de tipos**: Verificação de tipos
- **Regras de negócio**: Validações específicas
- **Segurança**: Verificação de propriedade

### Performance

- **Operações síncronas**: Para dados em memória
- **Filtros eficientes**: Algoritmos otimizados
- **Cache**: Evita recálculos desnecessários
- **Lazy loading**: Carregamento sob demanda

## Integração com Outras Camadas

### Com Contexts

```typescript
// No TaskContext
const taskService = new TaskService();

const createTask = useCallback(
  async (data: CreateTaskData) => {
    const newTask = await taskService.createTask(data, user.id);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  },
  [user, taskService]
);
```

### Com Repositories

```typescript
// No AuthService
class AuthService {
  constructor(private storage: IStorageRepository) {}

  saveUserSession(user: User, token: string) {
    this.storage.setItem("user", JSON.stringify(user));
    this.storage.setItem("token", token);
  }
}
```

### Com Types

```typescript
// Interfaces bem definidas
interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  priority: TaskPriority;
  tags?: string[];
}
```

## Testabilidade

### Mocking

- **Interfaces**: Fácil implementação de mocks
- **Dados de teste**: Usuários e tarefas mock
- **Isolamento**: Testes independentes

### Cobertura

- **Casos de sucesso**: Operações normais
- **Casos de erro**: Falhas e exceções
- **Validações**: Dados inválidos
- **Edge cases**: Cenários extremos
