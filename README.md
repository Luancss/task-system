# TaskManager - Gerenciador de Tarefas

Uma aplicação completa para gerenciamento de tarefas desenvolvida com Next.js 15, TypeScript e Tailwind CSS. O sistema permite que usuários criem, visualizem, editem e excluam tarefas com autenticação baseada em JWT simulado.

## 🚀 Funcionalidades

### ✅ Autenticação de Usuário

- Sistema de registro e login de usuários
- Autenticação baseada em JWT simulado (sem usar a lib jsonwebtoken)
- Dados mockados para demonstração
- Contas de teste pré-configuradas

### 📋 Gerenciamento de Tarefas

- **Criar tarefas** com título, descrição, status e data de vencimento
- **Visualizar tarefas** em cards organizados
- **Editar tarefas** existentes
- **Excluir tarefas** com confirmação
- **Status das tarefas**: Pendente, Em Andamento, Concluída

### 🔍 Listagem e Filtros

- Lista todas as tarefas do usuário logado
- **Filtros por status**: Todas, Pendentes, Em Andamento, Concluídas
- **Ordenação**: Por data de vencimento, data de criação ou título
- **Busca**: Por título ou descrição
- **Estatísticas**: Resumo de tarefas por status

### 📱 Responsividade

- Interface totalmente responsiva
- Otimizada para mobile, tablet e desktop
- Design moderno e intuitivo

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Página do dashboard
│   ├── tasks/            # Páginas de tarefas
│   │   ├── [id]/         # Detalhes e edição de tarefa
│   │   └── new/          # Criação de nova tarefa
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial (auth)
├── components/           # Componentes React
│   ├── auth/            # Componentes de autenticação
│   ├── dashboard/       # Componentes do dashboard
│   ├── tasks/           # Componentes de tarefas
│   └── ui/              # Componentes de interface
├── contexts/            # Contextos React
│   ├── AuthContext.tsx  # Contexto de autenticação
│   └── TaskContext.tsx  # Contexto de tarefas
├── lib/                 # Utilitários e dados mockados
│   ├── mockData.ts      # Dados mockados e JWT simulado
│   └── utils.ts         # Funções utilitárias
└── types/               # Definições de tipos TypeScript
    └── index.ts         # Interfaces e tipos
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun

### Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd vylex
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Execute o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 👤 Contas de Teste

A aplicação vem com contas pré-configuradas para teste:

### Usuário 1

- **Email**: joao@email.com
- **Senha**: 123456

### Usuário 2

- **Email**: maria@email.com
- **Senha**: 123456

## 📱 Funcionalidades Detalhadas

### Dashboard

- Resumo das tarefas com estatísticas
- Cards com contadores de tarefas por status
- Indicadores de tarefas vencidas e que vencem hoje
- Acesso rápido para criar nova tarefa

### Lista de Tarefas

- Grid responsivo de cards de tarefas
- Filtros por status com contadores
- Ordenação por data de vencimento, criação ou título
- Busca em tempo real por título/descrição
- Indicadores visuais para tarefas vencidas

### Detalhes da Tarefa

- Visualização completa dos dados da tarefa
- Informações de criação e última atualização
- Ações para editar ou excluir
- Navegação intuitiva

### Formulários

- Validação em tempo real
- Campos obrigatórios marcados
- Interface responsiva
- Feedback visual de carregamento

## 🎨 Design e UX

- **Design System**: Baseado em Tailwind CSS com tema customizado
- **Componentes**: Utilizando Radix UI para acessibilidade
- **Ícones**: Lucide React para consistência visual
- **Cores**: Sistema de cores adaptável (light/dark mode ready)
- **Tipografia**: Fontes Geist para melhor legibilidade

## 🔒 Segurança

- Autenticação baseada em JWT simulado
- Validação de dados com Zod
- Proteção de rotas autenticadas
- Verificação de propriedade de tarefas
- Sanitização de inputs

## 📊 Princípios SOLID Aplicados

- **Single Responsibility**: Cada componente tem uma responsabilidade específica
- **Open/Closed**: Componentes extensíveis via props
- **Liskov Substitution**: Interfaces bem definidas
- **Interface Segregation**: Contextos específicos para Auth e Tasks
- **Dependency Inversion**: Uso de contextos para injeção de dependência

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint
```

## 📝 Próximas Melhorias

- [ ] Implementar modo escuro
- [ ] Adicionar notificações push
- [ ] Sistema de categorias para tarefas
- [ ] Upload de anexos
- [ ] Compartilhamento de tarefas
- [ ] Relatórios e analytics
- [ ] Integração com calendário
- [ ] API REST real com backend

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS.

---

**TaskManager** - Organize suas tarefas de forma eficiente e moderna! 🎯
