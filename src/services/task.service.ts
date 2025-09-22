import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskSortOptions,
  TaskStatistics,
  TaskStatus,
  TaskPriority,
} from "@/types";
import { mockTasks } from "@/lib/mocks";
import { TASK_CONSTANTS, ERROR_MESSAGES } from "@/lib/constants";

export interface ITaskService {
  createTask(data: CreateTaskData, userId: string): Promise<Task>;
  updateTask(
    id: string,
    updates: UpdateTaskData,
    userId: string
  ): Promise<Task | null>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  getTaskById(id: string, userId: string): Task | null;
  getTasksByUserId(userId: string): Task[];
  getFilteredTasks(
    filters: TaskFilters,
    userId: string,
    sort?: TaskSortOptions
  ): Task[];
  getTaskStatistics(userId: string): TaskStatistics;
}

export class TaskService implements ITaskService {
  private tasks: Task[] = [];

  constructor(initialTasks: Task[] = mockTasks) {
    this.tasks = initialTasks;
  }

  async createTask(data: CreateTaskData, userId: string): Promise<Task> {
    const newTask: Task = {
      id: this.generateTaskId(),
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status || TASK_CONSTANTS.DEFAULT_STATUS,
      dueDate: data.dueDate,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: data.priority || TASK_CONSTANTS.DEFAULT_PRIORITY,
      tags: data.tags || [],
    };

    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(
    id: string,
    updates: UpdateTaskData,
    userId: string
  ): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(
      (task) => task.id === id && task.userId === userId
    );

    if (taskIndex === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...updates,
      title: updates.title?.trim() || this.tasks[taskIndex].title,
      description:
        updates.description?.trim() || this.tasks[taskIndex].description,
      updatedAt: new Date(),
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(
      (task) => task.id === id && task.userId === userId
    );

    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  getTaskById(id: string, userId: string): Task | null {
    return (
      this.tasks.find((task) => task.id === id && task.userId === userId) ||
      null
    );
  }

  getTasksByUserId(userId: string): Task[] {
    return this.tasks.filter((task) => task.userId === userId);
  }

  getFilteredTasks(
    filters: TaskFilters,
    userId: string,
    sort?: TaskSortOptions
  ): Task[] {
    let filteredTasks = this.getTasksByUserId(userId);

    // Aplicar filtros
    if (filters.status && filters.status !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }

    if (filters.priority && filters.priority !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filters.priority
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.dueDateRange) {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate >= filters.dueDateRange!.start &&
          taskDate <= filters.dueDateRange!.end
        );
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        task.tags?.some((tag) => filters.tags!.includes(tag))
      );
    }

    // Aplicar ordenação
    if (sort) {
      filteredTasks.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
          case "title":
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case "dueDate":
            aValue = new Date(a.dueDate).getTime();
            bValue = new Date(b.dueDate).getTime();
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "priority":
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          case "status":
            const statusOrder = {
              pending: 1,
              in_progress: 2,
              completed: 3,
              cancelled: 4,
            };
            aValue = statusOrder[a.status];
            bValue = statusOrder[b.status];
            break;
          default:
            return 0;
        }

        if (sort.order === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filteredTasks;
  }

  getTaskStatistics(userId: string): TaskStatistics {
    const userTasks = this.getTasksByUserId(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = userTasks.filter(
      (task) => new Date(task.dueDate) < today && task.status !== "completed"
    ).length;

    const dueToday = userTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const taskDueDate = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );
      return (
        taskDueDate.getTime() === today.getTime() && task.status !== "completed"
      );
    }).length;

    const byPriority: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    userTasks.forEach((task) => {
      byPriority[task.priority]++;
    });

    return {
      total: userTasks.length,
      pending: userTasks.filter((task) => task.status === "pending").length,
      inProgress: userTasks.filter((task) => task.status === "in_progress")
        .length,
      completed: userTasks.filter((task) => task.status === "completed").length,
      cancelled: userTasks.filter((task) => task.status === "cancelled").length,
      overdue,
      dueToday,
      byPriority,
    };
  }

  private generateTaskId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Método para obter todas as tarefas (apenas para desenvolvimento)
  getAllTasks(): Task[] {
    return [...this.tasks];
  }
}
