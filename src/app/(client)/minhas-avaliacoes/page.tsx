"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../assets/logo.png";
import dayjs from "dayjs";
import { listMyAssessmentSheets, AssessmentSheet } from "@/services/assessmentService";

export default function ClientAvaliacoesPage() {
  const router = useRouter();
  const [sheets, setSheets] = useState<AssessmentSheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyAssessmentSheets()
      .then(setSheets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50">
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-pink-600">ESPAÇO FITNESS</h1>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition text-sm"
        >
          Voltar
        </button>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Minhas Avaliações</h2>

        {loading ? (
          <p className="text-gray-400 animate-pulse">Carregando...</p>
        ) : sheets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0H5" />
            </svg>
            <p className="text-gray-500">Nenhuma avaliação disponível ainda.</p>
            <p className="text-gray-400 text-sm mt-1">Fale com seu instrutor para solicitar uma avaliação.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                onClick={() => router.push(`/minhas-avaliacoes/${sheet.id}`)}
                className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-pink-50 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-pink-600 leading-none">
                    {dayjs(sheet.date).format("DD")}
                  </span>
                  <span className="text-xs text-pink-400 uppercase">
                    {dayjs(sheet.date).format("MMM")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">
                    Avaliação de {dayjs(sheet.date).format("DD/MM/YYYY")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sheet.peso != null && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sheet.peso} kg</span>
                    )}
                    {sheet.altura != null && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sheet.altura} cm</span>
                    )}
                    {sheet.imc != null && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">IMC {sheet.imc}</span>
                    )}
                    {sheet.gorduraPercent != null && (
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">{sheet.gorduraPercent}% gordura</span>
                    )}
                  </div>
                </div>

                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
