"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../../assets/logo.png";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import { getAssessmentSheetById, AssessmentSheet } from "@/services/assessmentService";

type FieldKey = keyof Omit<AssessmentSheet, "id" | "userId" | "createdAt" | "updatedAt" | "date">;
interface FieldDef { key: FieldKey; label: string; unit?: string }
interface Group { title: string; fields: FieldDef[] }

const FIELD_GROUPS: Group[] = [
  {
    title: "Medidas Gerais",
    fields: [
      { key: "altura", label: "Altura", unit: "cm" },
      { key: "peso", label: "Peso", unit: "kg" },
    ],
  },
  {
    title: "Membros Superiores",
    fields: [
      { key: "bracoD", label: "Braço D", unit: "cm" },
      { key: "bracoE", label: "Braço E", unit: "cm" },
      { key: "antebracoD", label: "Antebraço D", unit: "cm" },
      { key: "antebracoE", label: "Antebraço E", unit: "cm" },
      { key: "bicepsD", label: "Bíceps D", unit: "cm" },
      { key: "bicepsE", label: "Bíceps E", unit: "cm" },
    ],
  },
  {
    title: "Tronco",
    fields: [
      { key: "torax1", label: "Tórax 1", unit: "cm" },
      { key: "torax2", label: "Tórax 2", unit: "cm" },
      { key: "cintura", label: "Cintura", unit: "cm" },
      { key: "abdomen", label: "Abdômen", unit: "cm" },
      { key: "quadril", label: "Quadril", unit: "cm" },
    ],
  },
  {
    title: "Membros Inferiores",
    fields: [
      { key: "coxaSupD", label: "Coxa Sup D", unit: "cm" },
      { key: "coxaSupE", label: "Coxa Sup E", unit: "cm" },
      { key: "coxaMedD", label: "Coxa Med D", unit: "cm" },
      { key: "coxaMedE", label: "Coxa Med E", unit: "cm" },
      { key: "coxaInfD", label: "Coxa Inf D", unit: "cm" },
      { key: "coxaInfE", label: "Coxa Inf E", unit: "cm" },
      { key: "pantD", label: "Panturrilha D", unit: "cm" },
      { key: "pantE", label: "Panturrilha E", unit: "cm" },
    ],
  },
  {
    title: "Bioimpedância",
    fields: [
      { key: "imc", label: "IMC" },
      { key: "gorduraPercent", label: "Gordura", unit: "%" },
      { key: "musculoPercent", label: "Músculo", unit: "%" },
      { key: "visceralFat", label: "Gordura Visceral" },
      { key: "idadeCorporal", label: "Idade Corporal" },
      { key: "metabolismoBasal", label: "Metabolismo Basal", unit: "kcal" },
    ],
  },
];

export default function ClientAssessmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [sheet, setSheet] = useState<AssessmentSheet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessmentSheetById(id)
      .then(setSheet)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Avaliação não encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @page {
          margin: 0;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 16mm 14mm; }
          .print-container { max-width: 100% !important; padding: 0 !important; }
          .print-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50">
        <header className="no-print flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 shadow-md">
          <div className="flex items-center space-x-3">
            <Image src={Logo} alt="Logo" width={40} height={40} />
            <h1 className="text-2xl font-bold text-pink-600">ESPAÇO FITNESS</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm font-medium text-pink-600 border border-pink-300 hover:bg-pink-50 px-4 py-2 rounded-full transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Imprimir / PDF
            </button>
            <button
              onClick={() => router.push("/minhas-avaliacoes")}
              className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition text-sm"
            >
              Voltar
            </button>
          </div>
        </header>

        <main className="print-container p-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ficha de Avaliação</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {dayjs(sheet.date).format("DD [de] MMMM [de] YYYY")}
              </p>
            </div>
            <div className="hidden print:flex items-center gap-2">
              <Image src={Logo} alt="Logo" width={36} height={36} />
              <span className="font-bold text-pink-600">ESPAÇO FITNESS</span>
            </div>
          </div>

          {FIELD_GROUPS.map((group) => {
            const filled = group.fields.filter((f) => sheet[f.key] != null);
            if (filled.length === 0) return null;
            return (
              <div key={group.title} className="print-card bg-white rounded-2xl shadow p-5 mb-4">
                <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-4 pb-2 border-b border-pink-100">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filled.map((f) => (
                    <div key={f.key} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                      <p className="text-lg font-bold text-gray-800">
                        {sheet[f.key]}
                        {f.unit && <span className="text-sm font-normal text-gray-500 ml-1">{f.unit}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-center text-gray-400 mt-6 no-print">
            Use o botão &quot;Imprimir / PDF&quot; para salvar este documento.
          </p>
        </main>
      </div>
    </>
  );
}
