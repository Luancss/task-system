# Documentação do Projeto

Bem-vindo à documentação completa do projeto, um sistema moderno de gerenciamento de tarefas construído com Next.js e TypeScript.

## 📚 Índice da Documentação

### [Contexts](contexts.md)

Documentação completa dos contexts React utilizados no projeto:

- **AuthContext**: Gerenciamento de autenticação e sessão do usuário
- **TaskContext**: Gerenciamento de estado das tarefas e operações CRUD

### [Hooks](hooks.md)

Documentação dos hooks customizados:

- **useTaskOperations**: Hook para operações de tarefas com gerenciamento de estado
- **useDatePicker**: Hook para seleção de datas
- **useIsMobile**: Hook para detecção de dispositivos mobile

### [Repositories](repositories.md)

Documentação da camada de dados:

- **IStorageRepository**: Interface para operações de armazenamento
- **LocalStorageRepository**: Implementação usando localStorage
- **MemoryStorageRepository**: Implementação em memória para testes

### [Services](services.md)

Documentação da lógica de negócio:

- **AuthService**: Serviço de autenticação com JWT
- **TaskService**: Serviço de gerenciamento de tarefas

### [Types](types.md)

Documentação completa das definições TypeScript:

- **Entidades**: User, Task
- **Tipos de Autenticação**: LoginCredentials, RegisterData, AuthResult
- **Tipos de Tarefas**: CreateTaskData, UpdateTaskData, TaskFilters
- **Tipos de Contexto**: AuthContextType, TaskContextType
- **Tipos Utilitários**: ApiResponse, AppError

## 🏗️ Arquitetura do Projeto

O projeto Vylex segue uma arquitetura limpa e bem estruturada:

```
┌─────────────────┐
│   Components    │ ← Interface do usuário
├─────────────────┤
│    Contexts     │ ← Gerenciamento de estado
├─────────────────┤
│     Hooks       │ ← Lógica reutilizável
├─────────────────┤
│    Services     │ ← Lógica de negócio
├─────────────────┤
│  Repositories   │ ← Acesso a dados
├─────────────────┤
│     Types       │ ← Definições TypeScript
└─────────────────┘
```

## 🎯 Princípios de Design

### Separação de Responsabilidades

- **Components**: Apenas apresentação e interação
- **Contexts**: Gerenciamento de estado global
- **Hooks**: Lógica reutilizável e estado local
- **Services**: Lógica de negócio e validações
- **Repositories**: Acesso e persistência de dados
- **Types**: Definições de interface e contratos

### Type Safety

- TypeScript rigoroso em toda a aplicação
- Interfaces bem definidas para todas as operações
- Validação de tipos em tempo de compilação
- Documentação inline com JSDoc

### Performance

- Lazy loading de componentes
- Otimização de re-renderizações
- Uso eficiente de hooks
- Cache inteligente de dados

## 🔧 Padrões Utilizados

### Repository Pattern

Abstração da camada de dados para facilitar testes e mudanças de implementação.

### Service Layer

Encapsulamento da lógica de negócio em serviços especializados.

### Context Pattern

Gerenciamento de estado global com React Context API.

### Custom Hooks

Reutilização de lógica entre componentes.

### TypeScript Interfaces

Contratos bem definidos para todas as operações.

## 📖 Como Usar Esta Documentação

### Para Desenvolvedores

1. Comece com [Types](types.md) para entender as estruturas de dados
2. Leia [Services](services.md) para entender a lógica de negócio
3. Consulte [Contexts](contexts.md) para gerenciamento de estado
4. Use [Hooks](hooks.md) para lógica reutilizável
5. Implemente [Repositories](repositories.md) para acesso a dados

### Para Usuários

1. Consulte o [README principal](../README.md) para instalação
2. Use esta documentação para entender a arquitetura
3. Referencie os exemplos de código fornecidos

## 🚀 Exemplos Rápidos

### Criando uma Nova Tarefa

```typescript
import { useTasks } from "@/contexts/task-context";

function CreateTaskComponent() {
  const { createTask } = useTasks();

  const handleCreate = async () => {
    await createTask({
      title: "Nova Tarefa",
      description: "Descrição da tarefa",
      status: "pending",
      dueDate: new Date(),
      priority: "medium",
    });
  };
}
```

### Usando o Hook de Operações

```typescript
import { useTaskOperations } from "@/hooks/use-task-operations";

function TaskOperations() {
  const { createTask, isCreating, createError } = useTaskOperations();

  // Lógica de criação com estados de loading e erro
}
```

### Implementando um Novo Repository

```typescript
import { IStorageRepository } from "@/repositories/storage.repository";

class CustomStorageRepository implements IStorageRepository {
  getItem(key: string): string | null {
    // Implementação customizada
  }

  setItem(key: string, value: string): void {
    // Implementação customizada
  }

  // ... outros métodos
}
```

## 📝 Manutenção da Documentação

### Quando Atualizar

- Adicionar novas funcionalidades
- Modificar interfaces existentes
- Alterar padrões de arquitetura
- Corrigir informações incorretas

### Como Atualizar

1. Modifique o arquivo de documentação relevante
2. Atualize exemplos de código se necessário
3. Verifique se os links internos ainda funcionam
4. Teste os exemplos fornecidos

## 🤝 Contribuindo com a Documentação

1. **Clareza**: Escreva de forma clara e objetiva
2. **Exemplos**: Sempre inclua exemplos práticos
3. **Atualização**: Mantenha a documentação sincronizada com o código
4. **Revisão**: Revise antes de submeter

---

Esta documentação é um recurso vivo que evolui com o projeto. Mantenha-a atualizada e útil para todos os desenvolvedores.
