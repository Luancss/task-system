"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  Task,
  TaskContextType,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskSortOptions,
  TaskStatistics,
  TaskStatus,
} from "@/types";
import { TaskService } from "@/services/task.service";
import { useAuth } from "./auth-context";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const taskService = new TaskService();

  // Inicialização das tarefas
  useEffect(() => {
    if (user) {
      loadUserTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const loadUserTasks = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const userTasks = taskService.getTasksByUserId(user.id);
      setTasks(userTasks);
    } catch (err) {
      setError("Erro ao carregar tarefas");
      // console.error("Erro ao carregar tarefas:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, taskService]);

  const createTask = useCallback(
    async (data: CreateTaskData): Promise<Task> => {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      try {
        setIsLoading(true);
        setError(null);
        const newTask = await taskService.createTask(data, user.id);
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } catch (err) {
        setError("Erro ao criar tarefa");
        // console.error("Erro ao criar tarefa:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user, taskService]
  );

  const updateTask = useCallback(
    async (id: string, updates: UpdateTaskData): Promise<Task | null> => {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      try {
        setIsLoading(true);
        setError(null);
        const updatedTask = await taskService.updateTask(id, updates, user.id);

        if (updatedTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? updatedTask : task))
          );
        }

        return updatedTask;
      } catch (err) {
        setError("Erro ao atualizar tarefa");
        // console.error("Erro ao atualizar tarefa:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user, taskService]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      try {
        setIsLoading(true);
        setError(null);
        const success = await taskService.deleteTask(id, user.id);

        if (success) {
          setTasks((prev) => prev.filter((task) => task.id !== id));
        }

        return success;
      } catch (err) {
        setError("Erro ao excluir tarefa");
        // console.error("Erro ao excluir tarefa:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user, taskService]
  );

  const getTaskById = useCallback(
    (id: string): Task | null => {
      return taskService.getTaskById(id, user?.id || "");
    },
    [user, taskService]
  );

  const getTasksByStatus = useCallback(
    (status: TaskStatus): Task[] => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  const getTasksByUserId = useCallback(
    (userId: string): Task[] => {
      return taskService.getTasksByUserId(userId);
    },
    [taskService]
  );

  const getFilteredTasks = useCallback(
    (filters: TaskFilters, sort?: TaskSortOptions): Task[] => {
      if (!user) return [];
      return taskService.getFilteredTasks(filters, user.id, sort);
    },
    [user, taskService]
  );

  const getTaskStatistics = useCallback(
    (userId: string): TaskStatistics => {
      return taskService.getTaskStatistics(userId);
    },
    [taskService]
  );

  const value: TaskContextType = {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStatus,
    getTasksByUserId,
    getFilteredTasks,
    getTaskStatistics,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks deve ser usado dentro de um TaskProvider");
  }
  return context;
}
