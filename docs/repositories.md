# Documentação dos Repositories

## Visão Geral

Os repositories implementam o padrão Repository, fornecendo uma camada de abstração para o acesso a dados. Eles encapsulam a lógica de persistência e fornecem uma interface consistente independentemente da implementação subjacente.

## IStorageRepository

### Localização

`src/repositories/storage.repository.ts`

### Propósito

Interface que define o contrato para operações de armazenamento de dados.

### Interface

```typescript
export interface IStorageRepository {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
```

### Métodos

#### `getItem(key: string): string | null`

Recupera um item do armazenamento.

**Parâmetros:**

- `key`: Chave do item a ser recuperado

**Retorno:**

- `string | null`: Valor armazenado ou null se não encontrado

#### `setItem(key: string, value: string): void`

Armazena um item no storage.

**Parâmetros:**

- `key`: Chave do item
- `value`: Valor a ser armazenado

#### `removeItem(key: string): void`

Remove um item do armazenamento.

**Parâmetros:**

- `key`: Chave do item a ser removido

#### `clear(): void`

Limpa todo o armazenamento.

## LocalStorageRepository

### Localização

`src/repositories/storage.repository.ts`

### Propósito

Implementação do `IStorageRepository` que utiliza o localStorage do navegador.

### Características

#### Segurança SSR

- Verifica se `window` está disponível antes de acessar localStorage
- Retorna valores seguros durante server-side rendering
- Evita erros de hidratação

#### Tratamento de Erros

- Captura e loga erros de acesso ao localStorage
- Falha silenciosamente em caso de problemas
- Não quebra a aplicação em cenários de erro

### Exemplo de Uso

```typescript
import { LocalStorageRepository } from "@/repositories/storage.repository";

const storage = new LocalStorageRepository();

// Armazenar dados
storage.setItem("userToken", "abc123");

// Recuperar dados
const token = storage.getItem("userToken");

// Remover dados
storage.removeItem("userToken");

// Limpar tudo
storage.clear();
```

### Casos de Uso

- **Tokens de autenticação**: Armazenamento seguro de tokens
- **Preferências do usuário**: Configurações e preferências
- **Cache de dados**: Dados temporários para performance
- **Estado da aplicação**: Persistência de estado entre sessões

## MemoryStorageRepository

### Localização

`src/repositories/storage.repository.ts`

### Propósito

Implementação do `IStorageRepository` que utiliza memória (Map) para armazenamento.

### Características

#### Armazenamento em Memória

- Utiliza `Map<string, string>` para armazenamento
- Dados são perdidos ao recarregar a página
- Ideal para testes e desenvolvimento

#### Performance

- Acesso mais rápido que localStorage
- Sem limitações de quota
- Não persiste entre sessões

### Exemplo de Uso

```typescript
import { MemoryStorageRepository } from "@/repositories/storage.repository";

const storage = new MemoryStorageRepository();

// Mesma interface que LocalStorageRepository
storage.setItem("testKey", "testValue");
const value = storage.getItem("testKey");
```

### Casos de Uso

- **Testes unitários**: Isolamento de dados entre testes
- **Desenvolvimento**: Evita poluir localStorage durante desenvolvimento
- **SSR**: Alternativa segura para server-side rendering
- **Protótipos**: Implementação rápida sem persistência

## Padrão Repository

### Benefícios

#### Abstração

- Interface consistente independente da implementação
- Facilita mudanças de implementação
- Reduz acoplamento com tecnologias específicas

#### Testabilidade

- Fácil mockagem para testes
- Implementações alternativas para diferentes cenários
- Isolamento de dependências externas

#### Flexibilidade

- Múltiplas implementações para diferentes necessidades
- Troca de implementação sem afetar código cliente
- Configuração baseada em ambiente

### Exemplo de Injeção de Dependência

```typescript
// Configuração baseada em ambiente
const storage =
  process.env.NODE_ENV === "test"
    ? new MemoryStorageRepository()
    : new LocalStorageRepository();

// Uso em serviços
class AuthService {
  constructor(private storage: IStorageRepository) {}

  saveToken(token: string) {
    this.storage.setItem("authToken", token);
  }
}
```

## Integração com Services

### AuthService

```typescript
import { LocalStorageRepository } from "@/repositories/storage.repository";

class AuthService {
  private storage: IStorageRepository;

  constructor() {
    this.storage = new LocalStorageRepository();
  }

  saveAuthData(token: string, user: User) {
    this.storage.setItem("authToken", token);
    this.storage.setItem("userData", JSON.stringify(user));
  }
}
```

### TaskService

```typescript
class TaskService {
  private storage: IStorageRepository;

  constructor() {
    this.storage = new LocalStorageRepository();
  }

  saveTasks(tasks: Task[]) {
    this.storage.setItem("tasks", JSON.stringify(tasks));
  }

  loadTasks(): Task[] {
    const data = this.storage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  }
}
```

## Tratamento de Erros

### Estratégias

- **Falha silenciosa**: Não quebra a aplicação
- **Logs detalhados**: Para debugging
- **Fallbacks**: Valores padrão em caso de erro
- **Validação**: Verificação de dados antes de armazenar

### Exemplo de Tratamento Robusto

```typescript
class SafeStorageRepository implements IStorageRepository {
  private storage: IStorageRepository;

  constructor(storage: IStorageRepository) {
    this.storage = storage;
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error(`Erro ao armazenar ${key}:`, error);
    }
  }
}
```

## Considerações de Segurança

### Dados Sensíveis

- **Tokens**: Armazenados de forma segura
- **Senhas**: Nunca armazenadas em texto plano
- **Dados pessoais**: Criptografados quando necessário

### Validação

- **Sanitização**: Dados são validados antes do armazenamento
- **Tipos**: Verificação de tipos para evitar corrupção
- **Tamanho**: Limitação de tamanho para evitar overflow

## Performance

### Otimizações

- **Lazy loading**: Carregamento sob demanda
- **Cache**: Evita acessos desnecessários
- **Batch operations**: Operações em lote quando possível
- **Cleanup**: Limpeza automática de dados antigos

### Monitoramento

- **Métricas**: Acompanhamento de performance
- **Logs**: Registro de operações importantes
- **Alertas**: Notificações de problemas
