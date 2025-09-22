# Documentação dos Hooks

## Visão Geral

Os hooks customizados do projeto encapsulam lógica reutilizável e fornecem interfaces consistentes para funcionalidades específicas. Eles seguem as convenções do React e são otimizados para performance.

## useTaskOperations

### Localização

`src/hooks/use-task-operations.ts`

### Propósito

Hook customizado que encapsula as operações CRUD de tarefas com gerenciamento de estado de loading e tratamento de erros.

### Interface

```typescript
interface UseTaskOperationsReturn {
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskData) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  clearErrors: () => void;
}
```

### Funcionalidades

#### Operações CRUD

- **createTask**: Cria uma nova tarefa
- **updateTask**: Atualiza uma tarefa existente
- **deleteTask**: Exclui uma tarefa

#### Estados de Loading

- **isCreating**: Indica se uma operação de criação está em andamento
- **isUpdating**: Indica se uma operação de atualização está em andamento
- **isDeleting**: Indica se uma operação de exclusão está em andamento

#### Gerenciamento de Erros

- **createError**: Erro da última operação de criação
- **updateError**: Erro da última operação de atualização
- **deleteError**: Erro da última operação de exclusão
- **clearErrors**: Limpa todos os erros

### Exemplo de Uso

```typescript
import { useTaskOperations } from "@/hooks/use-task-operations";

function TaskComponent() {
  const {
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    clearErrors,
  } = useTaskOperations();

  const handleCreateTask = async () => {
    try {
      await createTask({
        title: "Nova Tarefa",
        description: "Descrição",
        status: "pending",
        dueDate: new Date(),
        priority: "medium",
      });
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateTask} disabled={isCreating}>
        {isCreating ? "Criando..." : "Criar Tarefa"}
      </button>

      {createError && <div className="error">{createError}</div>}
    </div>
  );
}
```

### Benefícios

- **Separação de responsabilidades**: Isola a lógica de operações de tarefas
- **Gerenciamento de estado**: Controla loading e erros automaticamente
- **Reutilização**: Pode ser usado em qualquer componente que precise de operações de tarefas
- **Consistência**: Padroniza o tratamento de erros e loading states

## useDatePicker

### Localização

`src/hooks/use-date-picker.ts`

### Propósito

Hook para gerenciar o estado de seleção de datas em componentes de date picker.

### Interface

```typescript
interface UseDatePickerProps {
  initialDate?: Date;
}

interface UseDatePickerReturn {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  reset: () => void;
}
```

### Funcionalidades

#### Estados

- **selectedDate**: Data atualmente selecionada
- **setSelectedDate**: Função para definir a data selecionada
- **reset**: Função para limpar a seleção

### Exemplo de Uso

```typescript
import { useDatePicker } from "@/hooks/use-date-picker";

function DatePickerComponent() {
  const { selectedDate, setSelectedDate, reset } = useDatePicker({
    initialDate: new Date(),
  });

  return (
    <div>
      <input
        type="date"
        value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
      <button onClick={reset}>Limpar</button>
    </div>
  );
}
```

### Características

- **Inicialização opcional**: Aceita uma data inicial
- **Sincronização**: Atualiza automaticamente quando a data inicial muda
- **Reset**: Permite limpar a seleção facilmente
- **TypeScript**: Totalmente tipado para melhor DX

## useIsMobile

### Localização

`src/hooks/use-mobile.ts`

### Propósito

Hook para detectar se o dispositivo atual é mobile baseado no tamanho da tela.

### Interface

```typescript
function useIsMobile(): boolean;
```

### Funcionalidades

#### Detecção Responsiva

- **Breakpoint**: 768px (padrão mobile)
- **Reatividade**: Atualiza automaticamente quando a tela é redimensionada
- **SSR Safe**: Retorna `undefined` inicialmente para evitar hidratação incorreta

### Exemplo de Uso

```typescript
import { useIsMobile } from "@/hooks/use-mobile";

function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return <div>{isMobile ? <MobileLayout /> : <DesktopLayout />}</div>;
}
```

### Características

- **Performance**: Usa `matchMedia` para detecção eficiente
- **Cleanup**: Remove event listeners automaticamente
- **Responsivo**: Reage a mudanças de tamanho de tela
- **SSR Compatible**: Funciona corretamente com server-side rendering

## Padrões e Convenções

### Nomenclatura

- Todos os hooks começam com `use`
- Nomes descritivos que indicam a funcionalidade
- Interfaces TypeScript bem definidas

### Estrutura

- **Estado local**: Gerenciado com `useState`
- **Efeitos**: Usados com `useEffect` quando necessário
- **Callbacks**: Otimizados com `useCallback` quando apropriado
- **Cleanup**: Sempre limpa recursos quando o componente desmonta

### Tratamento de Erros

- Erros são capturados e expostos através do estado
- Mensagens de erro são consistentes
- Logs detalhados para debugging

### Performance

- Uso de `useCallback` para evitar re-renderizações
- Cleanup adequado de event listeners
- Estados otimizados para evitar renders desnecessários

## Integração com Contexts

Os hooks trabalham em conjunto com os contexts:

- `useTaskOperations` utiliza `useTasks` internamente
- Hooks de UI (como `useDatePicker`) são independentes
- Hooks de detecção (como `useIsMobile`) são utilitários puros

## Testabilidade

Todos os hooks são testáveis:

- Lógica isolada e pura
- Estados bem definidos
- Interfaces claras
- Fácil mockagem para testes
