import { TaskStatus, TaskPriority } from "@/types";

export interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
  icon?: string;
}

export interface PriorityConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
  icon?: string;
}

export const taskStatusConfig: Record<TaskStatus, StatusConfig> = {
  pending: {
    label: "Pendente",
    variant: "secondary",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: "⏳",
  },
  in_progress: {
    label: "Em Andamento",
    variant: "default",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: "🔄",
  },
  completed: {
    label: "Concluída",
    variant: "default",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: "✅",
  },
  cancelled: {
    label: "Cancelada",
    variant: "destructive",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: "❌",
  },
};

export const taskPriorityConfig: Record<TaskPriority, PriorityConfig> = {
  low: {
    label: "Baixa",
    variant: "outline",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: "🟢",
  },
  medium: {
    label: "Média",
    variant: "secondary",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: "🟡",
  },
  high: {
    label: "Alta",
    variant: "default",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: "🟠",
  },
  urgent: {
    label: "Urgente",
    variant: "destructive",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: "🔴",
  },
};

export function getStatusConfig(status: TaskStatus): StatusConfig {
  return taskStatusConfig[status];
}

export function getPriorityConfig(priority: TaskPriority): PriorityConfig {
  return taskPriorityConfig[priority];
}
