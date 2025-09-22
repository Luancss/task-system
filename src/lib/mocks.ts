import { User, Task } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Vylex",
    email: "vylex@email.com",
    password: "123456",
    createdAt: new Date("2024-01-01"),
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implementar autenticação",
    description: "Criar sistema de login e registro de usuários",
    status: "completed",
    dueDate: new Date("2024-01-15"),
    userId: "1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Criar dashboard",
    description: "Desenvolver interface principal do sistema",
    status: "in_progress",
    dueDate: new Date("2024-01-20"),
    userId: "1",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    title: "Implementar CRUD de tarefas",
    description: "Criar operações de criar, ler, atualizar e deletar tarefas",
    status: "pending",
    dueDate: new Date("2024-01-25"),
    userId: "1",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "4",
    title: "Configurar testes",
    description: "Implementar testes unitários e de integração",
    status: "pending",
    dueDate: new Date("2024-01-30"),
    userId: "2",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "5",
    title: "Documentar API",
    description: "Criar documentação completa da API",
    status: "in_progress",
    dueDate: new Date("2024-02-01"),
    userId: "2",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-17"),
  },
];

// Simulação de JWT simples
export const generateMockToken = (userId: string): string => {
  const payload = {
    userId,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  };

  // Simulação simples de JWT (base64)
  return btoa(JSON.stringify(payload));
};

export const verifyMockToken = (token: string): { userId: string } | null => {
  try {
    const payload = JSON.parse(atob(token));

    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
};
