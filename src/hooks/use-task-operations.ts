import { useState } from "react";
import { Task } from "@/types";
import { useTasks } from "@/contexts/task-context";

export function useTaskOperations() {
  const { deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDeleteTask,
    isDeleting,
  };
}
