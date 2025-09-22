export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface TaskContextType {
  tasks: Task[];
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  getTaskById: (id: string) => Task | null;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByUserId: (userId: string) => Task[];
}

export interface CreateTaskForm {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}
