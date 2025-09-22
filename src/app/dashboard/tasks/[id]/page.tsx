"use client";

import { useParams, useRouter } from "next/navigation";
import { useTasks } from "@/contexts/task-context";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TaskModal } from "@/components/dashboard/tasks/task-modal";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Task } from "@/types";

const statusConfig = {
  pending: {
    label: "Pendente",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  in_progress: {
    label: "Em Andamento",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  completed: {
    label: "Concluída",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getTaskById, deleteTask } = useTasks();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(
    getTaskById(params.id as string)
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const foundTask = getTaskById(params.id as string);
    setTask(foundTask);
  }, [params.id, getTaskById]);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Tarefa não encontrada
            </h2>
            <p className="text-muted-foreground mb-4">
              A tarefa que você está procurando não existe ou foi removida.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se o usuário é o dono da tarefa
  if (task.userId !== user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso negado</h2>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para visualizar esta tarefa.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    if (
      confirm(
        "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      )
    ) {
      const success = await deleteTask(task.id);
      if (success) {
        router.push("/dashboard");
      }
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    // Atualizar a tarefa após edição
    const updatedTask = getTaskById(params.id as string);
    setTask(updatedTask);
  };

  const status = statusConfig[task.status];
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 pb-4 justify-end">
          <Button
            onClick={handleEdit}
            size="lg"
            className="flex items-center gap-2 cursor-pointer px-8 py-3"
          >
            <Edit className="h-5 w-5" />
            Editar Tarefa
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            size="lg"
            className="flex items-center gap-2 cursor-pointer px-8 py-3"
          >
            <Trash2 className="h-5 w-5" />
            Excluir Tarefa
          </Button>
        </div>
        <div className="space-y-8">
          {/* Task Header */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className={`${status.color} text-sm px-3 py-1`}>
                        {status.label}
                      </Badge>
                      {isOverdue && (
                        <Badge
                          variant="destructive"
                          className="text-sm px-3 py-1"
                        >
                          Vencida
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {task.description && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Descrição
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-base leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Task Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  Data de Vencimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {format(new Date(task.dueDate), "dd", { locale: ptBR })}
                    </p>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                      {format(new Date(task.dueDate), "MMM yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {format(new Date(task.dueDate), "EEEE, HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Criada em
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {format(
                        new Date(task.createdAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Última atualização
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {format(
                        new Date(task.updatedAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de Edição */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        task={task}
        mode="edit"
      />
    </div>
  );
}
