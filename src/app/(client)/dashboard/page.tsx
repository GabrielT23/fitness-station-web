"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../assets/logo.png";

export default function Dashboard() {
  const router = useRouter();

  const logout = () => {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'companyId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Image src={Logo} alt="Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold text-pink-600">ESPAÇO FITNESS</h1>
        </div>
        <button
          onClick={logout}
          className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo */}
      <main className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">AREA DO ALUNO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Fichas de Avaliação */}
          <div
            onClick={() => alert("Fluxo de fichas de avaliações ainda não implementado")}
            className="
              cursor-pointer bg-white p-6 rounded-2xl shadow-lg
              hover:shadow-xl transform hover:-translate-y-1 transition
              flex flex-col items-center justify-center space-y-4
            "
          >
            <div className="text-pink-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0H5m4 0v3m6-3v3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">Fichas de Avaliações</h3>
            <p className="text-gray-500 text-center text-sm">
              Acompanhe indicadores e metas em tempo real.
            </p>
          </div>

          {/* Card de Fichas de Treino */}
          <div
            onClick={() => router.push("/workoutSheets")}
            className="
              cursor-pointer bg-white p-6 rounded-2xl shadow-lg
              hover:shadow-xl transform hover:-translate-y-1 transition
              flex flex-col items-center justify-center space-y-4
            "
          >
            <div className="text-pink-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m4-2H8m12 6a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">Fichas de Treino</h3>
            <p className="text-gray-500 text-center text-sm">
              Visualize e organize seus treinos personalizados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

