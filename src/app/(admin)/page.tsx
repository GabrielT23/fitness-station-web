// app/admin/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useWorkoutSheets } from "@/hooks/useWorkoutSheets";
import { listExercises } from "@/services/exerciseService";

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-pink-600">{value}</p>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  const { users, loading: loadingUsers } = useUsers();
  const { sheets, loading: loadingSheets } = useWorkoutSheets();
  const [exercisesCount, setExercisesCount] = useState<number | null>(null);
  const [newUsers7d, setNewUsers7d] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Busca todos os exercícios
    listExercises()
      .then((exList) => setExercisesCount(exList.length))
      .catch(() => setExercisesCount(0));
  }, []);

  useEffect(() => {
    if (!loadingUsers) {
      const now = Date.now();
      const SEVEN = 1000 * 60 * 60 * 24 * 7;
      const THIRTY = SEVEN * 30;

      setNewUsers7d(
        users.filter((u) => now - new Date(u.createdAt).getTime() <= SEVEN)
          .length
      );
      setActiveUsers(
        users.filter(
          (u) =>
            u.lastPayment &&
            now - new Date(u.lastPayment).getTime() <= THIRTY
        ).length
      );
    }
  }, [users, loadingUsers]);

  const loadingAll = loadingUsers || loadingSheets || exercisesCount === null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Painel Administrativo
      </h1>

      {/* Métricas principais */}
      {loadingAll ? (
        <p>Carregando métricas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Alunos Ativos" value={activeUsers} icon="👤" />
          <MetricCard
            title="Fichas de Treino"
            value={sheets.length}
            icon="📋"
          />
          <MetricCard
            title="Exercícios Cadastrados"
            value={exercisesCount!}
            icon="🏋️"
          />
          <MetricCard
            title="Novos Cadastros (7d)"
            value={newUsers7d}
            icon="🆕"
          />
        </div>
      )}

      {/* Lista de fichas recentes */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Fichas Recentes
        </h2>
        {loadingSheets ? (
          <p>Carregando fichas...</p>
        ) : sheets.length ? (
          <ul className="space-y-4">
            {sheets
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 5)
              .map((sheet) => (
                <li
                  key={sheet.id}
                  className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-medium text-pink-600">
                      {sheet.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Criada em{" "}
                      {new Date(sheet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {}}
                    className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition"
                  >
                    Ver detalhes
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhuma ficha recente.</p>
        )}
      </section>
    </div>
  );
}

