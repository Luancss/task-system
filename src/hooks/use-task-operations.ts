import { useState, useCallback } from "react";
import { Task, CreateTaskData, UpdateTaskData } from "@/types";
import { useTasks } from "@/contexts/task-context";

export interface UseTaskOperationsReturn {
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskData) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  clearErrors: () => void;
}

export function useTaskOperations(): UseTaskOperationsReturn {
  const {
    createTask: contextCreateTask,
    updateTask: contextUpdateTask,
    deleteTask: contextDeleteTask,
  } = useTasks();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const createTask = useCallback(
    async (data: CreateTaskData): Promise<Task> => {
      setIsCreating(true);
      setCreateError(null);

      try {
        const newTask = await contextCreateTask(data);
        return newTask;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao criar tarefa";
        setCreateError(errorMessage);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [contextCreateTask]
  );

  const updateTask = useCallback(
    async (id: string, updates: UpdateTaskData): Promise<Task | null> => {
      setIsUpdating(true);
      setUpdateError(null);

      try {
        const updatedTask = await contextUpdateTask(id, updates);
        return updatedTask;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao atualizar tarefa";
        setUpdateError(errorMessage);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [contextUpdateTask]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      setDeleteError(null);

      try {
        const success = await contextDeleteTask(id);
        return success;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao excluir tarefa";
        setDeleteError(errorMessage);
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [contextDeleteTask]
  );

  const clearErrors = useCallback(() => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    clearErrors,
  };
}
