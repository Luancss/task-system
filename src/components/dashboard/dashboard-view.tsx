"use client";

import { TaskList } from "@/components/dashboard/tasks/task-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useTasks } from "@/contexts/task-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { useMemo } from "react";

export function DashboardView() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const userTasks = useMemo(() => {
    return tasks.filter((task) => task.userId === user?.id);
  }, [tasks, user?.id]);

  const taskStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = userTasks.filter(
      (task) => new Date(task.dueDate) < today && task.status !== "completed"
    ).length;

    const dueToday = userTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const taskDueDate = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );
      return (
        taskDueDate.getTime() === today.getTime() && task.status !== "completed"
      );
    }).length;

    const completed = userTasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pending = userTasks.filter(
      (task) => task.status === "pending"
    ).length;
    const inProgress = userTasks.filter(
      (task) => task.status === "in_progress"
    ).length;

    return {
      total: userTasks.length,
      completed,
      pending,
      inProgress,
      overdue,
      dueToday,
    };
  }, [userTasks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Olá, {user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Aqui está um resumo das suas tarefas para hoje,{" "}
            {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Total de Tarefas
              </CardTitle>
              <Calendar className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {taskStats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Concluídas
              </CardTitle>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {taskStats.completed}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:border-l-red-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Vencidas
              </CardTitle>
              <AlertCircle className="h-6 w-6 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">
                {taskStats.overdue}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:border-l-orange-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Vencem Hoje
              </CardTitle>
              <Clock className="h-6 w-6 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">
                {taskStats.dueToday}
              </div>
            </CardContent>
          </Card>
        </div>

        <TaskList />
      </main>
    </div>
  );
}
