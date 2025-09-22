import { renderHook, act } from "@testing-library/react";
import { TaskProvider, useTasks } from "@/contexts/task-context";
import { TaskService } from "@/services/task.service";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskStatistics,
} from "@/types";

jest.mock("@/services/task.service");
jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}));

const MockedTaskService = TaskService as jest.MockedClass<typeof TaskService>;
const mockUseAuth = require("@/contexts/auth-context")
  .useAuth as jest.MockedFunction<any>;

const createWrapper = (mockUser: any = null) => {
  return ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );
};

describe("TaskContext", () => {
  let mockTaskService: jest.Mocked<TaskService>;
  let mockUser: any;

  beforeEach(() => {
    mockUser = {
      id: "user1",
      name: "Test User",
      email: "test@example.com",
    };

    mockTaskService = {
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      getTaskById: jest.fn(),
      getTasksByUserId: jest.fn().mockReturnValue([]),
      getFilteredTasks: jest.fn(),
      getTaskStatistics: jest.fn(),
      getAllTasks: jest.fn(),
    } as any;

    MockedTaskService.mockImplementation(() => mockTaskService);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("inicialização", () => {
    it("deve carregar tarefas do usuário na inicialização", async () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          status: "pending",
          priority: "medium",
          dueDate: new Date("2024-12-31"),
          userId: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        },
      ];

      mockTaskService.getTasksByUserId.mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      await act(async () => {});

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("deve limpar tarefas quando usuário não está autenticado", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(null),
      });

      await act(async () => {});

      expect(result.current.tasks).toEqual([]);
    });
  });

  describe("createTask", () => {
    it("deve criar tarefa com sucesso", async () => {
      const newTask: Task = {
        id: "2",
        title: "New Task",
        description: "New Description",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      const taskData: CreateTaskData = {
        title: "New Task",
        description: "New Description",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      mockTaskService.createTask.mockResolvedValue(newTask);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      let createdTask;
      await act(async () => {
        createdTask = await result.current.createTask(taskData);
      });

      expect(createdTask).toEqual(newTask);
      expect(result.current.tasks).toContain(newTask);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        taskData,
        "user1"
      );
    });

    it("deve lançar erro quando usuário não está autenticado", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(null),
      });

      const taskData: CreateTaskData = {
        title: "New Task",
        description: "New Description",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      await act(async () => {
        await expect(result.current.createTask(taskData)).rejects.toThrow(
          "Usuário não autenticado"
        );
      });
    });

    it("deve lidar com erro ao criar tarefa", async () => {
      const taskData: CreateTaskData = {
        title: "New Task",
        description: "New Description",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      mockTaskService.createTask.mockRejectedValue(new Error("Service error"));

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      await act(async () => {
        try {
          await result.current.createTask(taskData);
        } catch (error) {}
      });

      expect(result.current.error).toBe("Erro ao criar tarefa");
    });
  });

  describe("updateTask", () => {
    it("deve atualizar tarefa com sucesso", async () => {
      const existingTask: Task = {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      const updatedTask: Task = {
        ...existingTask,
        title: "Updated Task",
        status: "completed",
      };

      const updates: UpdateTaskData = {
        title: "Updated Task",
        status: "completed",
      };

      mockTaskService.getTasksByUserId.mockReturnValue([existingTask]);
      mockTaskService.updateTask.mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      await act(async () => {});

      expect(result.current.tasks).toContain(existingTask);

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updateTask("1", updates);
      });

      expect(updateResult).toEqual(updatedTask);
      expect(result.current.tasks).toContain(updatedTask);
      expect(result.current.tasks).not.toContain(existingTask);
    });

    it("deve retornar null quando tarefa não é encontrada", async () => {
      const updates: UpdateTaskData = {
        title: "Updated Task",
      };

      mockTaskService.updateTask.mockResolvedValue(null);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updateTask("999", updates);
      });

      expect(updateResult).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("deve deletar tarefa com sucesso", async () => {
      const taskToDelete: Task = {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      mockTaskService.getTasksByUserId.mockReturnValue([taskToDelete]);
      mockTaskService.deleteTask.mockResolvedValue(true);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      await act(async () => {});

      expect(result.current.tasks).toContain(taskToDelete);

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteTask("1");
      });

      expect(deleteResult).toBe(true);
      expect(result.current.tasks).not.toContain(taskToDelete);
    });

    it("deve retornar false quando tarefa não é encontrada", async () => {
      mockTaskService.deleteTask.mockResolvedValue(false);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteTask("999");
      });

      expect(deleteResult).toBe(false);
    });
  });

  describe("getTaskById", () => {
    it("deve retornar tarefa por ID", () => {
      const mockTask: Task = {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      mockTaskService.getTaskById.mockReturnValue(mockTask);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      const task = result.current.getTaskById("1");

      expect(task).toEqual(mockTask);
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith("1", "user1");
    });
  });

  describe("getTasksByStatus", () => {
    it("deve retornar tarefas por status", async () => {
      const pendingTask: Task = {
        id: "1",
        title: "Pending Task",
        description: "Description",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      const completedTask: Task = {
        id: "2",
        title: "Completed Task",
        description: "Description",
        status: "completed",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      mockTaskService.getTasksByUserId.mockReturnValue([
        pendingTask,
        completedTask,
      ]);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      await act(async () => {});

      expect(result.current.tasks).toHaveLength(2);

      const pendingTasks = result.current.getTasksByStatus("pending");
      expect(pendingTasks).toHaveLength(1);
      expect(pendingTasks[0]).toEqual(pendingTask);
    });
  });

  describe("getFilteredTasks", () => {
    it("deve retornar tarefas filtradas", () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          status: "pending",
          priority: "medium",
          dueDate: new Date("2024-12-31"),
          userId: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        },
      ];

      const filters: TaskFilters = {
        status: "pending",
      };

      mockTaskService.getFilteredTasks.mockReturnValue(mockTasks);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      const filteredTasks = result.current.getFilteredTasks(filters);

      expect(filteredTasks).toEqual(mockTasks);
      expect(mockTaskService.getFilteredTasks).toHaveBeenCalledWith(
        filters,
        "user1",
        undefined
      );
    });

    it("deve retornar array vazio quando usuário não está autenticado", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      });

      const filters: TaskFilters = {
        status: "pending",
      };

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(null),
      });

      const filteredTasks = result.current.getFilteredTasks(filters);

      expect(filteredTasks).toEqual([]);
    });
  });

  describe("getTaskStatistics", () => {
    it("deve retornar estatísticas das tarefas", () => {
      const mockStats: TaskStatistics = {
        total: 10,
        pending: 5,
        inProgress: 3,
        completed: 2,
        cancelled: 0,
        overdue: 1,
        dueToday: 2,
        byPriority: {
          low: 2,
          medium: 5,
          high: 2,
          urgent: 1,
        },
      };

      mockTaskService.getTaskStatistics.mockReturnValue(mockStats);

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(mockUser),
      });

      const stats = result.current.getTaskStatistics("user1");

      expect(stats).toEqual(mockStats);
      expect(mockTaskService.getTaskStatistics).toHaveBeenCalledWith("user1");
    });
  });

  describe("useTasks hook", () => {
    it("deve lançar erro quando usado fora do TaskProvider", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTasks());
      }).toThrow("useTasks deve ser usado dentro de um TaskProvider");

      consoleSpy.mockRestore();
    });
  });
});
