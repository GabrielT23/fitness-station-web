"use client";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const logout = () => {
    // Limpa os cookies relacionados ao usuário
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'companyId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    // Redireciona para a página de login
    router.push('/login');
  };

  return (
    <div className="relative min-h-screen p-8">
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

      {/* Botão Sair */}
      <button
        className="absolute bottom-4 left-0 right-0 mx-auto bg-red-500 text-white px-6 py-2 rounded w-48"
        onClick={logout}
      >
        Sair
      </button>
    </div>
  );
}
