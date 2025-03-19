"use client";

import { useState } from "react";
import { useWorkoutSheets } from "@/hooks/useWorkoutSheets";
import { WorkoutSheet } from "@/services/workoutSheetService";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export default function WorkoutSheetList() {
  const { sheets, loading, removeSheet } = useWorkoutSheets();
  const [selectedSheet, setSelectedSheet] = useState<WorkoutSheet | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    await removeSheet(id);
  };

  const handleViewUsers = (sheet: WorkoutSheet) => {
    setSelectedSheet(sheet);
    setIsUserModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Fichas de Treino</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className="bg-white p-4 rounded shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold">{sheet.name}</h3>
              <p className="text-gray-600">Tipo: {sheet.type}</p>
              <p className="text-gray-600">
                Status: {sheet.isActive ? "Ativa" : "Inativa"}
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleViewUsers(sheet)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Ver Usuários
              </button>
              <button
                onClick={() => handleDelete(sheet.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para exibir usuários vinculados */}
      {isUserModalOpen && selectedSheet && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">
              Usuários vinculados à ficha: {selectedSheet.name}
            </h2>
            {selectedSheet.WorkoutSheetUsers.length > 0 ? (
              <ul className="space-y-2">
                {selectedSheet.WorkoutSheetUsers.map((user) => (
                  <li
                    key={user.user.id}
                    className="bg-gray-100 p-2 rounded flex justify-between items-center"
                  >
                    <span>{user.user.name}</span>
                    <span className="text-gray-500 text-sm">
                      {user.user.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum usuário vinculado.</p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}