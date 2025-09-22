"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useTaskOperations } from "@/hooks/use-task-operations";
import { getPriorityConfig, getStatusConfig } from "@/lib/task-status-config";
import { Task } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteTask, isDeleting } = useTaskOperations();

  const status = getStatusConfig(task.status);
  const priority = getPriorityConfig(task.priority);
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(task.id);
      await onDelete(task.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <Card
      className={`card-hover ${
        isOverdue ? "border-red-200 dark:border-red-800" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {task.title}
          </CardTitle>
          <div className="flex items-center gap-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={priority.color} variant="outline">
              {priority.icon} {priority.label}
            </Badge>
            <Badge className={status.color}>{status.label}</Badge>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {isOverdue && (
          <div className="text-xs text-red-600 dark:text-red-400 font-medium">
            ⚠️ Tarefa vencida
          </div>
        )}

        <div className="pt-2">
          <Link href={`/dashboard/tasks/${task.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full cursor-pointer"
            >
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </CardContent>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Tarefa"
        description="Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="destructive"
        icon={
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        }
      />
    </Card>
  );
}
