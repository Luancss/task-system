"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/contexts/task-context";
import { useAuth } from "@/contexts/auth-context";
import { Task, CreateTaskForm } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { DatePicker } from "@/components/ui/date-picker";
import { useDatePicker } from "@/hooks/use-date-picker";
import { Calendar, Save, X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  mode: "create" | "edit";
}

export function TaskModal({ isOpen, onClose, task, mode }: TaskModalProps) {
  const { createTask, updateTask } = useTasks();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CreateTaskForm>({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  const { selectedDate, setSelectedDate, reset } = useDatePicker();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task && mode === "edit") {
      const taskDate = new Date(task.dueDate);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: taskDate.toISOString().slice(0, 16),
      });
      setSelectedDate(taskDate);
    } else {
      // Para nova tarefa, definir data padrão como amanhã
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: "",
        description: "",
        status: "pending",
        dueDate: tomorrow.toISOString().slice(0, 16),
      });
      setSelectedDate(tomorrow);
    }
    setError("");
  }, [task, mode, isOpen, setSelectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!user) {
        setError("Usuário não autenticado");
        return;
      }

      const taskData = {
        ...formData,
        dueDate: selectedDate || new Date(),
        userId: user.id,
      };

      if (mode === "create") {
        await createTask(taskData);
      } else if (task) {
        await updateTask(task.id, taskData);
      }

      onClose();
    } catch (err) {
      setError("Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {mode === "create" ? "Nova Tarefa" : "Editar Tarefa"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Título *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Digite o título da tarefa"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes da tarefa (opcional)"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              disabled={isLoading}
              className="text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                label="Data de Vencimento"
                placeholder="Selecione uma data"
                disabled={isLoading}
                required={true}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 text-sm px-4 py-2"
            >
              <Save className="h-4 w-4" />
              {isLoading
                ? mode === "create"
                  ? "Criando..."
                  : "Salvando..."
                : mode === "create"
                ? "Criar Tarefa"
                : "Salvar Alterações"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm px-4 py-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
