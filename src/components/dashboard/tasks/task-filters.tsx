"use client";

import { TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, SortAsc, SortDesc } from "lucide-react";

interface TaskFiltersProps {
  statusFilter: TaskStatus | "all";
  sortBy: "dueDate" | "createdAt" | "title";
  sortOrder: "asc" | "desc";
  onStatusFilterChange: (status: TaskStatus | "all") => void;
  onSortChange: (
    sortBy: "dueDate" | "createdAt" | "title",
    sortOrder: "asc" | "desc"
  ) => void;
  taskCounts: {
    all: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export function TaskFilters({
  statusFilter,
  sortBy,
  sortOrder,
  onStatusFilterChange,
  onSortChange,
  taskCounts,
}: TaskFiltersProps) {
  const statusOptions = [
    { value: "all", label: "Todas", count: taskCounts.all },
    { value: "pending", label: "Pendentes", count: taskCounts.pending },
    {
      value: "in_progress",
      label: "Em Andamento",
      count: taskCounts.in_progress,
    },
    { value: "completed", label: "Concluídas", count: taskCounts.completed },
  ];

  const sortOptions = [
    { value: "dueDate", label: "Data de Vencimento" },
    { value: "createdAt", label: "Data de Criação" },
    { value: "title", label: "Título" },
  ];

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortChange(sortBy, newOrder);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Filtrar por Status
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onStatusFilterChange(option.value as TaskStatus | "all")
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              {option.label}
              <Badge variant="secondary" className="ml-1">
                {option.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Ordenar por
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onValueChange={(value: "dueDate" | "createdAt" | "title") =>
              onSortChange(value, sortOrder)
            }
          >
            <SelectTrigger className="w-[200px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="flex items-center gap-2 cursor-pointer"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
            {sortOrder === "asc" ? "Crescente" : "Decrescente"}
          </Button>
        </div>
      </div>
    </div>
  );
}
