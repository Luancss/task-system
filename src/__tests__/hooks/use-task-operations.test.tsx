import { renderHook, act } from "@testing-library/react";
import { useTaskOperations } from "@/hooks/use-task-operations";
import { useTasks } from "@/contexts/task-context";
import { Task, CreateTaskData, UpdateTaskData } from "@/types";

jest.mock("@/contexts/task-context");
const mockUseTasks = useTasks as jest.MockedFunction<typeof useTasks>;

describe("useTaskOperations", () => {
  const mockCreateTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    mockUseTasks.mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      tasks: [],
      // @ts-ignore
      loading: false,
      error: null,
      filters: {},
      setFilters: jest.fn(),
      refreshTasks: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("deve criar tarefa com sucesso", async () => {
      const mockTask: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      mockCreateTask.mockResolvedValue(mockTask);

      const { result } = renderHook(() => useTaskOperations());

      const taskData: CreateTaskData = {
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      let createdTask: Task | undefined;
      await act(async () => {
        createdTask = await result.current.createTask(taskData);
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();
      expect(createdTask).toEqual(mockTask);
      expect(mockCreateTask).toHaveBeenCalledWith(taskData);
    });

    it("deve lidar com erro ao criar tarefa", async () => {
      const errorMessage = "Erro ao criar tarefa";
      mockCreateTask.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTaskOperations());

      const taskData: CreateTaskData = {
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      await act(async () => {
        try {
          await result.current.createTask(taskData);
        } catch (error) {}
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBe(errorMessage);
    });

    it("deve definir isCreating como true durante a criação", async () => {
      let resolvePromise: (value: Task) => void;
      const promise = new Promise<Task>((resolve) => {
        resolvePromise = resolve;
      });
      mockCreateTask.mockReturnValue(promise);

      const { result } = renderHook(() => useTaskOperations());

      const taskData: CreateTaskData = {
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      act(() => {
        result.current.createTask(taskData);
      });

      expect(result.current.isCreating).toBe(true);

      await act(async () => {
        resolvePromise!({
          id: "1",
          title: "Test Task",
          description: "Test Description",
          status: "pending",
          priority: "medium",
          dueDate: new Date("2024-12-31"),
          userId: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        });
      });

      expect(result.current.isCreating).toBe(false);
    });
  });

  describe("updateTask", () => {
    it("deve atualizar tarefa com sucesso", async () => {
      const mockTask: Task = {
        id: "1",
        title: "Updated Task",
        description: "Updated Description",
        status: "completed",
        priority: "high",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      mockUpdateTask.mockResolvedValue(mockTask);

      const { result } = renderHook(() => useTaskOperations());

      const updates: UpdateTaskData = {
        title: "Updated Task",
        status: "completed",
      };

      let updatedTask: Task | null | undefined;
      await act(async () => {
        updatedTask = await result.current.updateTask("1", updates);
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();
      expect(updatedTask).toEqual(mockTask);
      expect(mockUpdateTask).toHaveBeenCalledWith("1", updates);
    });

    it("deve lidar com erro ao atualizar tarefa", async () => {
      const errorMessage = "Erro ao atualizar tarefa";
      mockUpdateTask.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTaskOperations());

      const updates: UpdateTaskData = {
        title: "Updated Task",
      };

      await act(async () => {
        try {
          await result.current.updateTask("1", updates);
        } catch (error) {}
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBe(errorMessage);
    });

    it("deve definir isUpdating como true durante a atualização", async () => {
      let resolvePromise: (value: Task | null) => void;
      const promise = new Promise<Task | null>((resolve) => {
        resolvePromise = resolve;
      });
      mockUpdateTask.mockReturnValue(promise);

      const { result } = renderHook(() => useTaskOperations());

      const updates: UpdateTaskData = {
        title: "Updated Task",
      };

      act(() => {
        result.current.updateTask("1", updates);
      });

      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        resolvePromise!({
          id: "1",
          title: "Updated Task",
          description: "Test Description",
          status: "pending",
          priority: "medium",
          dueDate: new Date("2024-12-31"),
          userId: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        });
      });

      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe("deleteTask", () => {
    it("deve deletar tarefa com sucesso", async () => {
      mockDeleteTask.mockResolvedValue(true);

      const { result } = renderHook(() => useTaskOperations());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.deleteTask("1");
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();
      expect(success).toBe(true);
      expect(mockDeleteTask).toHaveBeenCalledWith("1");
    });

    it("deve lidar com erro ao deletar tarefa", async () => {
      const errorMessage = "Erro ao deletar tarefa";
      mockDeleteTask.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTaskOperations());

      await act(async () => {
        try {
          await result.current.deleteTask("1");
        } catch (error) {}
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBe(errorMessage);
    });

    it("deve definir isDeleting como true durante a exclusão", async () => {
      let resolvePromise: (value: boolean) => void;
      const promise = new Promise<boolean>((resolve) => {
        resolvePromise = resolve;
      });
      mockDeleteTask.mockReturnValue(promise);

      const { result } = renderHook(() => useTaskOperations());

      act(() => {
        result.current.deleteTask("1");
      });

      expect(result.current.isDeleting).toBe(true);

      await act(async () => {
        resolvePromise!(true);
      });

      expect(result.current.isDeleting).toBe(false);
    });
  });

  describe("clearErrors", () => {
    it("deve limpar todos os erros", async () => {
      mockCreateTask.mockRejectedValue(new Error("Create error"));
      mockUpdateTask.mockRejectedValue(new Error("Update error"));
      mockDeleteTask.mockRejectedValue(new Error("Delete error"));

      const { result } = renderHook(() => useTaskOperations());

      await act(async () => {
        try {
          await result.current.createTask({
            title: "Test",
            description: "Test",
            dueDate: new Date(),
            status: "pending",
            priority: "medium",
          });
        } catch (error) {}
      });

      await act(async () => {
        try {
          await result.current.updateTask("1", { title: "Updated" });
        } catch (error) {}
      });

      await act(async () => {
        try {
          await result.current.deleteTask("1");
        } catch (error) {}
      });

      expect(result.current.createError).toBe("Create error");
      expect(result.current.updateError).toBe("Update error");
      expect(result.current.deleteError).toBe("Delete error");

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.createError).toBeNull();
      expect(result.current.updateError).toBeNull();
      expect(result.current.deleteError).toBeNull();
    });
  });

  describe("estados iniciais", () => {
    it("deve ter estados iniciais corretos", () => {
      const { result } = renderHook(() => useTaskOperations());

      expect(result.current.isCreating).toBe(false);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.createError).toBeNull();
      expect(result.current.updateError).toBeNull();
      expect(result.current.deleteError).toBeNull();
    });
  });
});
