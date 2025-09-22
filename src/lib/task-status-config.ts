import { TaskStatus } from "@/types";

export interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
}

export const taskStatusConfig: Record<TaskStatus, StatusConfig> = {
  pending: {
    label: "Pendente",
    variant: "secondary",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  in_progress: {
    label: "Em Andamento",
    variant: "default",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  completed: {
    label: "Concluída",
    variant: "default",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
};

export function getStatusConfig(status: TaskStatus): StatusConfig {
  return taskStatusConfig[status];
}
