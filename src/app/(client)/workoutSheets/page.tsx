"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listWorkoutSheetsClient } from '../../../services/workoutSheetService';

interface WorkoutSheet {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkoutSheetsPage() {
  const [sheets, setSheets] = useState<WorkoutSheet[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchSheets() {
      try {
        console.log('Buscando fichas de treino...');
        const data = await listWorkoutSheetsClient();
        setSheets(data);
      } catch (error) {
        console.error('Erro ao buscar fichas de treino:', error);
      }
    }
    fetchSheets();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Fichas de Treino</h1>
      <ul>
        {sheets.map(sheet => (
          <li
            key={sheet.id}
            className="border p-4 mb-4 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/workoutSheets/${sheet.id}`)}
          >
            <h2 className="text-xl font-semibold">{sheet.name}</h2>
            <p>Status: {sheet.isActive ? 'Ativa' : 'Inativa'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
