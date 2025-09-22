import { TaskService } from "@/services/task.service";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskSortOptions,
} from "@/types";
import { mockTasks } from "@/lib/mocks";

describe("TaskService", () => {
  let taskService: TaskService;
  let mockTasksData: Task[];

  beforeEach(() => {
    mockTasksData = [
      {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        userId: "user1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        tags: ["work", "urgent"],
      },
      {
        id: "2",
        title: "Task 2",
        description: "Description 2",
        status: "completed",
        priority: "high",
        dueDate: new Date("2024-12-30"),
        userId: "user1",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
        tags: ["personal"],
      },
      {
        id: "3",
        title: "Task 3",
        description: "Description 3",
        status: "in_progress",
        priority: "low",
        dueDate: new Date("2024-12-29"),
        userId: "user2",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
        tags: ["work"],
      },
    ];
    taskService = new TaskService(mockTasksData);
  });

  describe("createTask", () => {
    it("deve criar uma nova tarefa", async () => {
      const taskData: CreateTaskData = {
        title: "New Task",
        description: "New Description",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-12-31"),
        tags: ["work"],
      };

      const result = await taskService.createTask(taskData, "user1");

      expect(result).toBeDefined();
      expect(result.title).toBe("New Task");
      expect(result.description).toBe("New Description");
      expect(result.status).toBe("pending");
      expect(result.priority).toBe("medium");
      expect(result.userId).toBe("user1");
      expect(result.tags).toEqual(["work"]);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it("deve usar valores padrão quando não fornecidos", async () => {
      // @ts-ignore
      const taskData: CreateTaskData = {
        title: "New Task",
        description: "New Description",
        dueDate: new Date("2024-12-31"),
      };

      const result = await taskService.createTask(taskData, "user1");

      expect(result.status).toBe("pending");
      expect(result.priority).toBe("medium");
      expect(result.tags).toEqual([]);
    });

    it("deve normalizar título e descrição (trim)", async () => {
      const taskData: CreateTaskData = {
        title: "  New Task  ",
        description: "  New Description  ",
        dueDate: new Date("2024-12-31"),
        status: "pending",
        priority: "medium",
      };

      const result = await taskService.createTask(taskData, "user1");

      expect(result.title).toBe("New Task");
      expect(result.description).toBe("New Description");
    });
  });

  describe("updateTask", () => {
    it("deve atualizar uma tarefa existente", async () => {
      const updates: UpdateTaskData = {
        title: "Updated Task",
        status: "completed",
        priority: "high",
      };

      const result = await taskService.updateTask("1", updates, "user1");

      expect(result).toBeDefined();
      expect(result?.title).toBe("Updated Task");
      expect(result?.status).toBe("completed");
      expect(result?.priority).toBe("high");
      expect(result?.updatedAt).toBeDefined();
    });

    it("deve retornar null para tarefa inexistente", async () => {
      const updates: UpdateTaskData = {
        title: "Updated Task",
      };

      const result = await taskService.updateTask("999", updates, "user1");

      expect(result).toBeNull();
    });

    it("deve retornar null para tarefa de outro usuário", async () => {
      const updates: UpdateTaskData = {
        title: "Updated Task",
      };

      const result = await taskService.updateTask("1", updates, "user2");

      expect(result).toBeNull();
    });

    it("deve normalizar título e descrição (trim)", async () => {
      const updates: UpdateTaskData = {
        title: "  Updated Task  ",
        description: "  Updated Description  ",
      };

      const result = await taskService.updateTask("1", updates, "user1");

      expect(result?.title).toBe("Updated Task");
      expect(result?.description).toBe("Updated Description");
    });
  });

  describe("deleteTask", () => {
    it("deve deletar uma tarefa existente", async () => {
      const result = await taskService.deleteTask("1", "user1");

      expect(result).toBe(true);
    });

    it("deve retornar false para tarefa inexistente", async () => {
      const result = await taskService.deleteTask("999", "user1");

      expect(result).toBe(false);
    });

    it("deve retornar false para tarefa de outro usuário", async () => {
      const result = await taskService.deleteTask("1", "user2");

      expect(result).toBe(false);
    });
  });

  describe("getTaskById", () => {
    it("deve retornar tarefa existente", () => {
      const result = taskService.getTaskById("1", "user1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("1");
      expect(result?.title).toBe("Task 1");
    });

    it("deve retornar null para tarefa inexistente", () => {
      const result = taskService.getTaskById("999", "user1");

      expect(result).toBeNull();
    });

    it("deve retornar null para tarefa de outro usuário", () => {
      const result = taskService.getTaskById("1", "user2");

      expect(result).toBeNull();
    });
  });

  describe("getTasksByUserId", () => {
    it("deve retornar tarefas do usuário", () => {
      const result = taskService.getTasksByUserId("user1");

      expect(result).toHaveLength(2);
      expect(result.every((task) => task.userId === "user1")).toBe(true);
    });

    it("deve retornar array vazio para usuário sem tarefas", () => {
      const result = taskService.getTasksByUserId("user999");

      expect(result).toHaveLength(0);
    });
  });

  describe("getFilteredTasks", () => {
    it("deve filtrar por status", () => {
      const filters: TaskFilters = {
        status: "completed",
      };

      const result = taskService.getFilteredTasks(filters, "user1");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("completed");
    });

    it("deve filtrar por prioridade", () => {
      const filters: TaskFilters = {
        priority: "high",
      };

      const result = taskService.getFilteredTasks(filters, "user1");

      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe("high");
    });

    it("deve filtrar por termo de busca", () => {
      const filters: TaskFilters = {
        searchTerm: "Task 1",
      };

      const result = taskService.getFilteredTasks(filters, "user1");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Task 1");
    });

    it("deve filtrar por tags", () => {
      const filters: TaskFilters = {
        tags: ["work"],
      };

      const result = taskService.getFilteredTasks(filters, "user1");

      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain("work");
    });

    it("deve filtrar por intervalo de data", () => {
      const filters: TaskFilters = {
        dueDateRange: {
          start: new Date("2024-12-30"),
          end: new Date("2024-12-31"),
        },
      };

      const result = taskService.getFilteredTasks(filters, "user1");

      expect(result).toHaveLength(2);
    });

    it("deve ordenar por título", () => {
      const sort: TaskSortOptions = {
        field: "title",
        order: "asc",
      };

      const result = taskService.getFilteredTasks({}, "user1", sort);

      expect(result[0].title).toBe("Task 1");
      expect(result[1].title).toBe("Task 2");
    });

    it("deve ordenar por data de vencimento", () => {
      const sort: TaskSortOptions = {
        field: "dueDate",
        order: "desc",
      };

      const result = taskService.getFilteredTasks({}, "user1", sort);

      expect(new Date(result[0].dueDate).getTime()).toBeGreaterThanOrEqual(
        new Date(result[1].dueDate).getTime()
      );
    });

    it("deve ordenar por prioridade", () => {
      const sort: TaskSortOptions = {
        field: "priority",
        order: "desc",
      };

      const result = taskService.getFilteredTasks({}, "user1", sort);

      expect(result[0].priority).toBe("high");
      expect(result[1].priority).toBe("medium");
    });
  });

  describe("getTaskStatistics", () => {
    it("deve retornar estatísticas corretas", () => {
      const result = taskService.getTaskStatistics("user1");

      expect(result.total).toBe(2);
      expect(result.pending).toBe(1);
      expect(result.completed).toBe(1);
      expect(result.inProgress).toBe(0);
      expect(result.cancelled).toBe(0);
      expect(result.byPriority.low).toBe(0);
      expect(result.byPriority.medium).toBe(1);
      expect(result.byPriority.high).toBe(1);
      expect(result.byPriority.urgent).toBe(0);
    });

    it("deve calcular tarefas vencidas corretamente", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const taskData: CreateTaskData = {
        title: "Overdue Task",
        description: "Overdue Description",
        dueDate: pastDate,
        status: "pending",
        priority: "medium",
      };

      taskService.createTask(taskData, "user1");
      const result = taskService.getTaskStatistics("user1");

      expect(result.overdue).toBeGreaterThan(0);
    });

    it("deve calcular tarefas para hoje corretamente", () => {
      const today = new Date();

      const taskData: CreateTaskData = {
        title: "Today Task",
        description: "Today Description",
        dueDate: today,
        status: "pending",
        priority: "medium",
      };

      taskService.createTask(taskData, "user1");
      const result = taskService.getTaskStatistics("user1");

      expect(result.dueToday).toBeGreaterThan(0);
    });
  });

  describe("getAllTasks", () => {
    it("deve retornar todas as tarefas", () => {
      const result = taskService.getAllTasks();

      expect(result).toHaveLength(3);
    });
  });
});
