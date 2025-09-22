# Gerenciador de Tarefas

Um sistema moderno de gerenciamento de tarefas construído com Next.js, TypeScript e Tailwind CSS, oferecendo uma interface intuitiva e responsiva para organização pessoal e profissional.

## 🚀 Características

- **Autenticação Segura**: Sistema completo de login e registro com tokens JWT
- **Gerenciamento de Tarefas**: CRUD completo com filtros, ordenação e estatísticas
- **Interface Responsiva**: Design moderno que funciona em desktop e mobile
- **Tema Escuro/Claro**: Suporte completo a temas com persistência
- **Notificações**: Sistema de toasts para feedback do usuário
- **TypeScript**: Tipagem completa para melhor desenvolvimento
- **Arquitetura Limpa**: Separação clara de responsabilidades

## 🛠️ Tecnologias

- **Framework**: Next.js 15.5.3
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: Shadcn/ui
- **Autenticação**: JWT com criptografia
- **Notificações**: Sonner
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod
- **Data**: date-fns

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/Luancss/task-system.git
cd vylex
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### 4. Acesse a aplicação

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 📁 Estrutura do Projeto

```
vylex/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── dashboard/          # Páginas do dashboard
│   │   ├── globals.css         # Estilos globais
│   │   ├── layout.tsx          # Layout raiz
│   │   └── page.tsx            # Página inicial
│   ├── components/             # Componentes React
│   │   ├── auth/               # Componentes de autenticação
│   │   ├── dashboard/          # Componentes do dashboard
│   │   └── ui/                 # Componentes de UI base
│   ├── contexts/               # Contexts do React
│   │   ├── auth-context.tsx    # Context de autenticação
│   │   └── task-context.tsx    # Context de tarefas
│   ├── hooks/                  # Hooks customizados
│   │   ├── use-date-picker.ts  # Hook para seleção de datas
│   │   ├── use-mobile.ts       # Hook para detecção mobile
│   │   └── use-task-operations.ts # Hook para operações de tarefas
│   ├── lib/                    # Utilitários e configurações
│   │   ├── constants.ts        # Constantes da aplicação
│   │   ├── crypto.ts           # Funções de criptografia
│   │   ├── mocks.ts            # Dados mock para desenvolvimento
│   │   ├── task-status-config.ts # Configurações de status
│   │   ├── token-utils.ts      # Utilitários de token
│   │   ├── utils.ts            # Utilitários gerais
│   │   └── validation.ts       # Validações
│   ├── repositories/           # Camada de dados
│   │   └── storage.repository.ts # Repository para storage
│   ├── services/               # Lógica de negócio
│   │   ├── auth.service.ts     # Serviço de autenticação
│   │   └── task.service.ts     # Serviço de tarefas
│   └── types/                  # Definições TypeScript
│       └── index.ts            # Tipos da aplicação
├── docs/                       # Documentação
│   ├── contexts.md             # Documentação dos contexts
│   ├── hooks.md                # Documentação dos hooks
│   ├── repositories.md         # Documentação dos repositories
│   ├── services.md             # Documentação dos services
│   └── types.md                # Documentação dos types
├── public/                     # Arquivos estáticos
├── components.json             # Configuração do shadcn/ui
├── next.config.ts              # Configuração do Next.js
├── package.json                # Dependências e scripts
├── tailwind.config.ts          # Configuração do Tailwind
└── tsconfig.json               # Configuração do TypeScript
```

## 🎯 Funcionalidades

### Autenticação

- **Registro**: Criação de conta com validação
- **Login**: Autenticação segura com JWT
- **Logout**: Encerramento de sessão
- **Persistência**: Manutenção da sessão entre recarregamentos

### Gerenciamento de Tarefas

- **Criar**: Adicionar novas tarefas com detalhes completos
- **Editar**: Modificar tarefas existentes
- **Excluir**: Remover tarefas com confirmação
- **Filtrar**: Por status, prioridade, data e tags
- **Ordenar**: Por diferentes critérios
- **Buscar**: Pesquisa em título, descrição e tags

### Interface

- **Responsiva**: Adaptável a diferentes tamanhos de tela
- **Tema**: Suporte a modo claro e escuro
- **Notificações**: Feedback visual para ações
- **Acessibilidade**: Componentes acessíveis

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint
```

## 🎨 Personalização

### Temas

O projeto suporta temas personalizados através do Tailwind CSS. Modifique `tailwind.config.ts` para ajustar cores e estilos.

### Componentes

Os componentes base estão em `src/components/ui/` e podem ser customizados conforme necessário.

### Configurações

- **Constantes**: `src/lib/constants.ts`
- **Validações**: `src/lib/validation.ts`
- **Configurações de Status**: `src/lib/task-status-config.ts`

## 📚 Documentação

A documentação detalhada está disponível na pasta `docs/`:

- [Contexts](docs/contexts.md) - Documentação dos contexts React
- [Hooks](docs/hooks.md) - Documentação dos hooks customizados
- [Repositories](docs/repositories.md) - Documentação da camada de dados
- [Services](docs/services.md) - Documentação da lógica de negócio
- [Types](docs/types.md) - Documentação das definições TypeScript

## 🧪 Desenvolvimento

### Adicionando Novas Funcionalidades

1. **Defina os tipos** em `src/types/index.ts`
2. **Implemente a lógica** em `src/services/`
3. **Crie o context** se necessário em `src/contexts/`
4. **Desenvolva os componentes** em `src/components/`
5. **Adicione as páginas** em `src/app/`

### Padrões de Código

- **TypeScript**: Tipagem rigorosa
- **Componentes**: Funcionais com hooks
- **Estados**: Gerenciados via contexts
- **Estilos**: Tailwind CSS
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes
