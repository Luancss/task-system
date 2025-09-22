export interface User {
  readonly id: string;
  name: string;
  email: string;
  passwordHash: string;
  readonly createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}

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

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

// ===== AUTHENTICATION TYPES =====

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

// ===== TASK MANAGEMENT TYPES =====

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  priority: TaskPriority;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
  priority?: TaskPriority;
  tags?: string[];
}

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

export interface TaskSortOptions {
  field: "title" | "dueDate" | "createdAt" | "priority" | "status";
  order: "asc" | "desc";
}

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

// ===== FORM TYPES =====

export interface CreateTaskForm {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
  tags: string;
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  tags?: string;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== ERROR TYPES =====

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export type ErrorType =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND_ERROR"
  | "NETWORK_ERROR"
  | "SERVER_ERROR";

// ===== UTILITY TYPES =====

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
