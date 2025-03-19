"use client";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex space-x-4">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => alert('Fluxo de fichas de avaliações ainda não implementado')}
        >
          Fichas de Avaliações
        </button>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => router.push('/workoutSheets')}
        >
          Fichas de Treino
        </button>
      </div>
    </div>
  );
}
