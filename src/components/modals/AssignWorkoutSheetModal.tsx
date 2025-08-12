"use client";

import React, { useState } from "react";
import { useWorkoutSheets } from "@/hooks/useWorkoutSheets";
import { Button } from "@/components/buttons/Button";
import { toast } from "react-toastify";
import { Select } from "../inputs/Select";

interface Props {
  user: { id: string; name?: string };
  onClose: () => void;
}

export default function AssignWorkoutSheetModal({ user, onClose }: Props) {
  const { sheets, linkSheet } = useWorkoutSheets();
  const [selectedSheetId, setSelectedSheetId] = useState("");

  const handleAssign = async () => {
    if (!selectedSheetId) {
      toast.error("Selecione uma ficha primeiro.");
      return;
    }
    try {
      await linkSheet(user.id, selectedSheetId);
      toast.success("Ficha atribuída ao usuário.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atribuir ficha.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Atribuir ficha — {user.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <Select
            label="Ficha de Treino"
            value={selectedSheetId}
            onChange={(e) => setSelectedSheetId(e.target.value)}
            options={[{ value: "", label: "Selecione uma ficha" }, ...sheets.map(s => ({ value: s.id, label: s.name }))]}
          />

          <div className="flex justify-end gap-3 mt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={handleAssign} className="px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700">
              Atribuir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
