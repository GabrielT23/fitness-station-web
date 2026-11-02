"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getUserById, User } from "@/services/usersServices";
import {
  AssessmentSheet,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  createAssessmentSheet,
  deleteAssessmentSheet,
  listAssessmentSheetsByUser,
  updateAssessmentSheet,
} from "@/services/assessmentService";

// ─── Field definitions ────────────────────────────────────────────────────────

type FieldKey = keyof Omit<AssessmentSheet, "id" | "userId" | "createdAt" | "updatedAt" | "date">;

interface FieldDef {
  key: FieldKey;
  label: string;
  unit?: string;
}

const FIELD_GROUPS: { title: string; fields: FieldDef[] }[] = [
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

type FormValues = Record<FieldKey, string> & { date: string };

function emptyForm(date = ""): FormValues {
  const base: Partial<FormValues> = { date };
  for (const group of FIELD_GROUPS) {
    for (const f of group.fields) {
      base[f.key] = "";
    }
  }
  return base as FormValues;
}

function sheetToForm(sheet: AssessmentSheet): FormValues {
  const form: Partial<FormValues> = {
    date: dayjs(sheet.date).format("YYYY-MM-DD"),
  };
  for (const group of FIELD_GROUPS) {
    for (const f of group.fields) {
      const v = sheet[f.key];
      form[f.key] = v != null ? String(v) : "";
    }
  }
  return form as FormValues;
}

function formToPayload(form: FormValues): Partial<CreateAssessmentRequest> {
  const payload: Record<string, unknown> = { date: form.date };
  for (const group of FIELD_GROUPS) {
    for (const f of group.fields) {
      const v = form[f.key];
      payload[f.key] = v !== "" ? parseFloat(v) : null;
    }
  }
  return payload as Partial<CreateAssessmentRequest>;
}

// ─── Assessment Form Modal ────────────────────────────────────────────────────

function AssessmentModal({
  userId,
  editing,
  onClose,
  onSaved,
}: {
  userId: string;
  editing: AssessmentSheet | null;
  onClose: () => void;
  onSaved: (sheet: AssessmentSheet) => void;
}) {
  const [form, setForm] = useState<FormValues>(() =>
    editing ? sheetToForm(editing) : emptyForm(dayjs().format("YYYY-MM-DD"))
  );
  const [saving, setSaving] = useState(false);

  const field = (key: keyof FormValues, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    if (!form.date) { toast.error("Data é obrigatória."); return; }
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateAssessmentSheet(editing.id, formToPayload(form) as UpdateAssessmentRequest);
        toast.success("Avaliação atualizada!");
        onSaved(updated);
      } else {
        const created = await createAssessmentSheet({ ...formToPayload(form), userId, date: form.date } as CreateAssessmentRequest);
        toast.success("Avaliação criada!");
        onSaved(created);
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar avaliação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {editing ? "Editar Avaliação" : "Nova Avaliação"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line strokeWidth="2" strokeLinecap="round" x1="18" y1="6" x2="6" y2="18" />
              <line strokeWidth="2" strokeLinecap="round" x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Data da Avaliação <span className="text-pink-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => field("date", e.target.value)}
              className="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          {FIELD_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-pink-600 mb-3 pb-1 border-b border-pink-100">
                {group.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {group.fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {f.label}{f.unit ? ` (${f.unit})` : ""}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form[f.key]}
                      onChange={(e) => field(f.key, e.target.value)}
                      placeholder="—"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-60 transition"
          >
            {saving ? "Salvando..." : "Salvar Avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UserAssessmentsPage() {
  const params = useParams();
  const userId = params?.id as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [sheets, setSheets] = useState<AssessmentSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AssessmentSheet | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userData, sheetsData] = await Promise.all([
          getUserById(userId),
          listAssessmentSheetsByUser(userId),
        ]);
        if (cancelled) return;
        setUser(userData);
        setSheets(sheetsData);
      } catch {
        if (!cancelled) toast.error("Erro ao carregar dados.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId]);

  const handleSaved = (sheet: AssessmentSheet) => {
    setSheets((prev) => {
      const idx = prev.findIndex((s) => s.id === sheet.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = sheet;
        return updated;
      }
      return [sheet, ...prev];
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta avaliação?")) return;
    setDeletingId(id);
    try {
      await deleteAssessmentSheet(id);
      setSheets((prev) => prev.filter((s) => s.id !== id));
      toast.success("Avaliação excluída.");
    } catch {
      toast.error("Erro ao excluir avaliação.");
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (sheet: AssessmentSheet) => { setEditing(sheet); setModalOpen(true); };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/avaliacoes")}
            className="p-2 rounded-full hover:bg-pink-100 text-pink-600 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 truncate">
              {user?.name ?? "Aluno"}
            </h1>
            <p className="text-sm text-gray-400">@{user?.username} · {sheets.length} avaliação{sheets.length !== 1 ? "ões" : ""}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition flex-shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line strokeWidth="2" strokeLinecap="round" x1="12" y1="5" x2="12" y2="19" />
              <line strokeWidth="2" strokeLinecap="round" x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Avaliação
          </button>
        </div>

        {sheets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0H5" />
            </svg>
            <p className="text-gray-500 mb-4">Nenhuma avaliação cadastrada.</p>
            <button
              onClick={openCreate}
              className="px-6 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition"
            >
              Criar primeira avaliação
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-pink-50 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-pink-600 leading-none">
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
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {sheet.peso} kg
                      </span>
                    )}
                    {sheet.altura != null && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {sheet.altura} cm
                      </span>
                    )}
                    {sheet.gorduraPercent != null && (
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                        {sheet.gorduraPercent}% gord.
                      </span>
                    )}
                    {sheet.imc != null && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        IMC {sheet.imc}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(sheet)}
                    className="p-2 rounded-xl hover:bg-blue-50 text-blue-500 transition"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path strokeWidth="2" strokeLinecap="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(sheet.id)}
                    disabled={deletingId === sheet.id}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition disabled:opacity-50"
                    title="Excluir"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline strokeWidth="2" strokeLinecap="round" points="3 6 5 6 21 6" />
                      <path strokeWidth="2" strokeLinecap="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path strokeWidth="2" strokeLinecap="round" d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <AssessmentModal
          userId={userId}
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
