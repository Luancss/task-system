"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Task, TaskContextType } from "@/types";
import { mockTasks } from "@/lib/mocks";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (
    id: string,
    updates: Partial<Task>
  ): Promise<Task | null> => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return null;

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
    return updatedTask;
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    return true;
  };

  const getTaskById = (id: string): Task | null => {
    return tasks.find((task) => task.id === id) || null;
  };

  const value: TaskContextType = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStatus: () => [],
    getTasksByUserId: () => [],
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
