import React, { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { BottomNav, BackHeader } from "../Layout";
import { useAuth } from "../../contexts/AuthContext";

export const MotivationScreen: React.FC = () => {
  const { profile } = useAuth();
  const { tasks, loading, error, createTask, toggleTask, deleteTask, targetUserId } = useTasks();

  // UI State
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [submitError, setSubmitError] = useState<null | string>(null);

  // Dates
  const today = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  const currentTasks = tasks.filter((t) =>
    activeTab === "today" ? t.scheduled_date === today : t.scheduled_date === tomorrow
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const date = activeTab === "today" ? today : tomorrow;
      await createTask(newTitle, newDesc || undefined, date, newTime);

      setIsCreateModalOpen(false);
      setNewTitle("");
      setNewDesc("");
      setNewTime("09:00");
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  // ✅ FIX: id es UUID => string
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Borrar esta tarea?")) {
      await deleteTask(id);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 transition-colors duration-200 md:pb-6 md:pl-64">
      <BackHeader title="Mi Día" />

      <section className="px-6 pt-4 pb-2">
        <p className="text-[#618968] dark:text-[#aecfb4] text-lg font-medium">Tareas y Rutina</p>

        <div className="flex bg-gray-100 dark:bg-surface-dark p-1 rounded-xl mt-4">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === "today"
                ? "bg-white dark:bg-white/10 shadow-sm text-primary"
                : "text-gray-500"
            }`}
          >
            Hoy
          </button>

          <button
            onClick={() => setActiveTab("tomorrow")}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === "tomorrow"
                ? "bg-white dark:bg-white/10 shadow-sm text-primary"
                : "text-gray-500"
            }`}
          >
            Mañana
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 font-semibold">
            Error: {error}
          </p>
        )}
      </section>

      <section className="px-4 pb-2">
        {loading && <div className="p-8 text-center text-gray-400">Cargando rutina...</div>}

        {!loading && currentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl text-green-500">
                {!targetUserId ? "person_off" : "check_circle"}
              </span>
            </div>

            <p className="text-gray-500 font-medium">
              {!targetUserId ? "No hay un paciente vinculado" : "¡Todo listo por ahora!"}
            </p>

            <p className="text-gray-400 text-sm mt-1 text-center">
              {!targetUserId
                ? "Vincula a un paciente desde tu perfil para gestionar sus tareas."
                : "No hay tareas pendientes para este día."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {currentTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border transition-all ${
                  task.completed
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-100 dark:border-white/5"
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-primary border-primary text-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {task.completed && (
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  )}
                </button>

                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg leading-tight ${
                      task.completed ? "text-gray-500 line-through" : ""
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-bold">
                      {(task.scheduled_time ?? "09:00:00").slice(0, 5)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Create FAB */}
      {targetUserId && (
        <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white rounded-2xl p-4 shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl">add_task</span>
            <span className="font-bold pr-1">Nueva Tarea</span>
          </button>
        </div>
      )}

      {/* ✅ Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1c1d27] rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Nueva Tarea ({activeTab === "today" ? "Hoy" : "Mañana"})
            </h3>

            {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                  placeholder="Ej. Tomar medicación"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3 resize-none h-20"
                  placeholder="Detalles..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};