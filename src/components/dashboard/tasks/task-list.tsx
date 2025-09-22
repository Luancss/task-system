"use client";

import { useState, useMemo } from "react";
import { Task, TaskStatus } from "@/types";
import { useTasks } from "@/contexts/task-context";
import { useAuth } from "@/contexts/auth-context";
import { TaskCard } from "./task-card";
import { TaskFilters } from "./task-filters";
import { TaskModal } from "./task-modal";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TaskList() {
  const { tasks, deleteTask } = useTasks();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "createdAt" | "title">(
    "dueDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const userTasks = useMemo(() => {
    return tasks.filter((task) => task.userId === user?.id);
  }, [tasks, user?.id]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = userTasks;

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "dueDate":
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [userTasks, statusFilter, searchTerm, sortBy, sortOrder]);

  const taskCounts = useMemo(() => {
    return {
      all: userTasks.length,
      pending: userTasks.filter((task) => task.status === "pending").length,
      in_progress: userTasks.filter((task) => task.status === "in_progress")
        .length,
      completed: userTasks.filter((task) => task.status === "completed").length,
    };
  }, [userTasks]);

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleSortChange = (
    newSortBy: "dueDate" | "createdAt" | "title",
    newSortOrder: "asc" | "desc"
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Minhas Tarefas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Gerencie suas tarefas de forma organizada
          </p>
        </div>
        <Button
          onClick={handleCreateTask}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400"
        />
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onStatusFilterChange={setStatusFilter}
        onSortChange={handleSortChange}
        taskCounts={taskCounts}
      />
      {filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" ? (
              <>
                <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
                <p className="text-sm">
                  Tente ajustar os filtros ou termo de busca
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">
                  Nenhuma tarefa criada ainda
                </p>
                <p className="text-sm">Comece criando sua primeira tarefa</p>
              </>
            )}
          </div>
          <Button onClick={handleCreateTask} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Tarefa
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask || undefined}
        mode={editingTask ? "edit" : "create"}
      />
    </div>
  );
}
