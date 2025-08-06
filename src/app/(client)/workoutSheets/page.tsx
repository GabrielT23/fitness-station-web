"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../assets/logo.png';
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
        const data = await listWorkoutSheetsClient();
        setSheets(data);
      } catch (error) {
        console.error('Erro ao buscar fichas de treino:', error);
      }
    }
    fetchSheets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-pink-600">ESPAÇO FITNESS</h1>
        </div>
        <button
          className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition"
          onClick={() => router.push('/dashboard')}
        >
          Voltar
        </button>
      </header>

      {/* Conteúdo */}
      <main className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fichas de Treino</h2>
        {sheets.length === 0 ? (
          <p className="text-gray-600">Nenhuma ficha encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheets.map(sheet => (
              <div
                key={sheet.id}
                onClick={() => router.push(`/workoutSheets/${sheet.id}`)}
                className="
                  cursor-pointer bg-white p-6 rounded-2xl shadow-lg
                  hover:shadow-xl transform hover:-translate-y-1 transition
                  flex flex-col justify-between
                "
              >
                <div>
                  <h3 className="text-xl font-bold text-pink-600 mb-2">{sheet.name}</h3>
                  <p className="text-gray-700">
                    Status:{' '}
                    <span
                      className={
                        sheet.isActive
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {sheet.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    className="
                      w-full text-center py-2 rounded-lg font-medium
                      bg-pink-600 text-white hover:bg-pink-700 transition
                    "
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

