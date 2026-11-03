"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  getWorkoutSheetById,
  updateWorkoutSheet,
  linkSheetToUser,
  unLinkSheetToUser,
  WorkoutSheet,
  WorkoutSheetUser,
} from "@/services/workoutSheetService";
import {
  createWorkout as apiCreateWorkout,
  updateWorkout as apiUpdateWorkout,
  deleteWorkout as apiDeleteWorkout,
} from "@/services/workoutService";
import {
  createExercise as apiCreateExercise,
  updateExercise as apiUpdateExercise,
  deleteExercise as apiDeleteExercise,
} from "@/services/exerciseService";
import { listUsers, User } from "@/services/usersServices";
import { useWorkoutSheets } from "@/hooks/useWorkoutSheets";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

// ─── Constants ────────────────────────────────────────────────────────────────

const MUSCLE_OPTIONS = [
  { value: "CHEST", label: "Peito" },
  { value: "BACK", label: "Costas" },
  { value: "LEGS", label: "Pernas" },
  { value: "SHOULDERS", label: "Ombros" },
  { value: "ARMS", label: "Braços" },
  { value: "CORE", label: "Core" },
];

const muscleLabel = (v: string) =>
  MUSCLE_OPTIONS.find((m) => m.value === v)?.label ?? v;

interface ExerciseForm {
  name: string;
  reps: number;
  sets: number;
  muscleGroup: string;
  restPeriod: number;
  videoLink: string;
}

const EMPTY_EXERCISE: ExerciseForm = {
  name: "",
  reps: 1,
  sets: 1,
  muscleGroup: "CHEST",
  restPeriod: 30,
  videoLink: "",
};

type Tab = "info" | "workouts" | "users";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="3 6 5 6 21 6" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconX() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line strokeWidth="2" strokeLinecap="round" x1="18" y1="6" x2="6" y2="18" />
      <line strokeWidth="2" strokeLinecap="round" x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconUserMinus() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" strokeWidth="2" />
      <line strokeWidth="2" strokeLinecap="round" x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

// ─── Exercise Inline Form ─────────────────────────────────────────────────────

function ExerciseFormInline({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
  title,
}: {
  form: ExerciseForm;
  onChange: (f: ExerciseForm) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
}) {
  const field = (key: keyof ExerciseForm, value: string | number) =>
    onChange({ ...form, [key]: value });

  return (
    <div className="bg-pink-50 rounded-xl p-4 space-y-3">
      <p className="text-sm font-semibold text-pink-700">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nome do exercício *</label>
          <input
            autoFocus
            type="text"
            value={form.name}
            onChange={(e) => field("name", e.target.value)}
            placeholder="Ex: Supino reto"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Grupo muscular *</label>
          <select
            value={form.muscleGroup}
            onChange={(e) => field("muscleGroup", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            {MUSCLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Séries *</label>
          <input
            type="number"
            min={1}
            value={form.sets}
            onChange={(e) => field("sets", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Repetições *</label>
          <input
            type="number"
            min={1}
            value={form.reps}
            onChange={(e) => field("reps", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Descanso (seg) *</label>
          <input
            type="number"
            min={0}
            value={form.restPeriod}
            onChange={(e) => field("restPeriod", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Link do vídeo</label>
          <input
            type="url"
            value={form.videoLink}
            onChange={(e) => field("videoLink", e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={saving || !form.name.trim()}
          className="px-4 py-1.5 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 disabled:opacity-60 transition"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

// ─── Exercise Row ─────────────────────────────────────────────────────────────

function ExerciseRow({
  exercise,
  onUpdate,
  onDelete,
}: {
  exercise: WorkoutSheet["workouts"][number]["exercises"][number];
  onUpdate: (updated: typeof exercise) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ExerciseForm>({
    name: exercise.name,
    reps: exercise.reps,
    sets: exercise.sets,
    muscleGroup: exercise.muscleGroup,
    restPeriod: exercise.restPeriod,
    videoLink: exercise.videoLink ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const updated = await apiUpdateExercise(exercise.id, form);
      onUpdate({ ...exercise, ...updated });
      setEditing(false);
      toast.success("Exercício atualizado!");
    } catch {
      toast.error("Erro ao atualizar exercício.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDeleteExercise(exercise.id);
      onDelete();
      toast.success("Exercício excluído.");
    } catch {
      toast.error("Erro ao excluir exercício.");
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div className="p-3">
        <ExerciseFormInline
          form={form}
          onChange={setForm}
          onSave={handleSave}
          onCancel={() => { setEditing(false); setForm({ name: exercise.name, reps: exercise.reps, sets: exercise.sets, muscleGroup: exercise.muscleGroup, restPeriod: exercise.restPeriod, videoLink: exercise.videoLink ?? "" }); }}
          saving={saving}
          title="Editar Exercício"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-800 text-sm">{exercise.name}</span>
          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
            {muscleLabel(exercise.muscleGroup)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {exercise.sets} séries × {exercise.reps} rep • {exercise.restPeriod}s descanso
          {exercise.videoLink && (
            <a
              href={exercise.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-pink-500 underline"
              onClick={(e) => e.stopPropagation()}
            >
              Ver vídeo
            </a>
          )}
        </p>
      </div>
      <div className="flex items-center gap-1 transition">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"
          title="Editar exercício"
        >
          <IconEdit />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50"
          title="Excluir exercício"
        >
          <IconTrash />
        </button>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Excluir exercício"
        message={`Deseja excluir o exercício "${exercise.name}"? Esta ação é irreversível.`}
      />
    </div>
  );
}

// ─── Workout Card ─────────────────────────────────────────────────────────────

function WorkoutCard({
  workout,
  sheet,
  onUpdate,
}: {
  workout: WorkoutSheet["workouts"][number];
  sheet: WorkoutSheet;
  onUpdate: (s: WorkoutSheet) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(workout.name);
  const [savingName, setSavingName] = useState(false);
  const [deletingWorkout, setDeletingWorkout] = useState(false);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = useState(false);
  const [addingExercise, setAddingExercise] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>(EMPTY_EXERCISE);
  const [savingExercise, setSavingExercise] = useState(false);

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    setSavingName(true);
    try {
      await apiUpdateWorkout(workout.id, { name: nameValue.trim() });
      onUpdate({
        ...sheet,
        workouts: sheet.workouts.map((w) =>
          w.id === workout.id ? { ...w, name: nameValue.trim() } : w
        ),
      });
      setEditingName(false);
      toast.success("Treino atualizado!");
    } catch {
      toast.error("Erro ao atualizar treino.");
    } finally {
      setSavingName(false);
    }
  };

  const handleDeleteWorkout = async () => {
    setDeletingWorkout(true);
    try {
      await apiDeleteWorkout(workout.id);
      onUpdate({ ...sheet, workouts: sheet.workouts.filter((w) => w.id !== workout.id) });
      toast.success("Treino excluído.");
    } catch {
      toast.error("Erro ao excluir treino.");
      setDeletingWorkout(false);
    }
  };

  const handleAddExercise = async () => {
    if (!exerciseForm.name.trim()) return;
    setSavingExercise(true);
    try {
      const created = await apiCreateExercise({ ...exerciseForm, workoutId: workout.id });
      onUpdate({
        ...sheet,
        workouts: sheet.workouts.map((w) =>
          w.id === workout.id ? { ...w, exercises: [...w.exercises, created] } : w
        ),
      });
      setExerciseForm(EMPTY_EXERCISE);
      setAddingExercise(false);
      toast.success("Exercício adicionado!");
    } catch {
      toast.error("Erro ao criar exercício.");
    } finally {
      setSavingExercise(false);
    }
  };

  const handleExerciseUpdated = (
    exerciseId: string,
    updated: WorkoutSheet["workouts"][number]["exercises"][number]
  ) => {
    onUpdate({
      ...sheet,
      workouts: sheet.workouts.map((w) =>
        w.id === workout.id
          ? { ...w, exercises: w.exercises.map((e) => (e.id === exerciseId ? updated : e)) }
          : w
      ),
    });
  };

  const handleExerciseDeleted = (exerciseId: string) => {
    onUpdate({
      ...sheet,
      workouts: sheet.workouts.map((w) =>
        w.id === workout.id
          ? { ...w, exercises: w.exercises.filter((e) => e.id !== exerciseId) }
          : w
      ),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => setExpanded((s) => !s)}
          className="flex items-center gap-2 flex-1 text-left min-w-0"
        >
          <span className="text-pink-500 flex-shrink-0">
            <IconChevron open={expanded} />
          </span>

          {editingName ? (
            <input
              autoFocus
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") { setEditingName(false); setNameValue(workout.name); }
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 px-2 py-1 rounded-lg border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          ) : (
            <span className="font-semibold text-gray-800 truncate">{workout.name}</span>
          )}
        </button>

        <span className="text-xs text-gray-400 flex-shrink-0">
          {workout.exercises.length} exercício{workout.exercises.length !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-1 flex-shrink-0">
          {editingName ? (
            <>
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="p-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60 transition"
                title="Salvar nome"
              >
                {savingName ? <span className="text-xs">...</span> : <IconCheck />}
              </button>
              <button
                onClick={() => { setEditingName(false); setNameValue(workout.name); }}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                title="Cancelar"
              >
                <IconX />
              </button>
            </>
          ) : (
            <button
              onClick={() => { setEditingName(true); setExpanded(true); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
              title="Editar nome do treino"
            >
              <IconEdit />
            </button>
          )}
          <button
            onClick={() => setConfirmDeleteWorkout(true)}
            disabled={deletingWorkout}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50"
            title="Excluir treino"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteWorkout}
        onClose={() => setConfirmDeleteWorkout(false)}
        onConfirm={handleDeleteWorkout}
        title="Excluir treino"
        message={`Deseja excluir o treino "${workout.name}" e todos os seus exercícios? Esta ação é irreversível.`}
      />

      {/* Expanded: exercises */}
      {expanded && (
        <div className="border-t border-gray-100">
          {workout.exercises.length === 0 && !addingExercise && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum exercício. Adicione o primeiro!</p>
          )}

          <div className="divide-y divide-gray-100">
            {workout.exercises.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                onUpdate={(updated) => handleExerciseUpdated(ex.id, updated)}
                onDelete={() => handleExerciseDeleted(ex.id)}
              />
            ))}
          </div>

          <div className="p-3">
            {addingExercise ? (
              <ExerciseFormInline
                form={exerciseForm}
                onChange={setExerciseForm}
                onSave={handleAddExercise}
                onCancel={() => { setAddingExercise(false); setExerciseForm(EMPTY_EXERCISE); }}
                saving={savingExercise}
                title="Novo Exercício"
              />
            ) : (
              <button
                onClick={() => setAddingExercise(true)}
                className="w-full py-2 rounded-xl border-2 border-dashed border-pink-200 text-pink-500 text-sm hover:bg-pink-50 transition"
              >
                + Adicionar Exercício
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

function InfoTab({
  sheet,
  onUpdate,
}: {
  sheet: WorkoutSheet;
  onUpdate: (s: WorkoutSheet) => void;
}) {
  const [form, setForm] = useState({
    name: sheet.name,
    type: sheet.type,
    isActive: sheet.isActive,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório."); return; }
    setSaving(true);
    try {
      const updated = await updateWorkoutSheet(sheet.id, form);
      onUpdate({ ...sheet, ...updated });
      toast.success("Ficha atualizada!");
    } catch {
      toast.error("Erro ao atualizar ficha.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Ficha</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <select
          value={form.type}
          onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white"
        >
          <option value="default">Padrão</option>
          <option value="custom">Personalizada</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          role="switch"
          aria-checked={form.isActive}
          onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            form.isActive ? "bg-pink-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              form.isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {form.isActive ? "Ficha Ativa" : "Ficha Inativa"}
        </span>
      </div>

      <div className="pt-2">
        <p className="text-xs text-gray-400 mb-4">
          Criada em {new Date(sheet.createdAt).toLocaleDateString("pt-BR")} •
          Última atualização em {new Date(sheet.updatedAt).toLocaleDateString("pt-BR")}
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-60 transition"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}

// ─── Workouts Tab ─────────────────────────────────────────────────────────────

function WorkoutsTab({
  sheet,
  onUpdate,
}: {
  sheet: WorkoutSheet;
  onUpdate: (s: WorkoutSheet) => void;
}) {
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [savingNewWorkout, setSavingNewWorkout] = useState(false);

  const handleAddWorkout = async () => {
    if (!newWorkoutName.trim()) return;
    setSavingNewWorkout(true);
    try {
      const created = await apiCreateWorkout({ name: newWorkoutName.trim(), workoutSheetId: sheet.id });
      onUpdate({ ...sheet, workouts: [...sheet.workouts, { ...created, exercises: [] }] });
      setNewWorkoutName("");
      setAddingWorkout(false);
      toast.success("Treino adicionado!");
    } catch {
      toast.error("Erro ao criar treino.");
    } finally {
      setSavingNewWorkout(false);
    }
  };

  return (
    <div className="space-y-4">
      {sheet.workouts.length === 0 && !addingWorkout && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm">
          <p className="text-lg mb-1">Nenhum treino cadastrado.</p>
          <p className="text-sm">Clique em &quot;+ Adicionar Treino&quot; para começar.</p>
        </div>
      )}

      {sheet.workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          sheet={sheet}
          onUpdate={onUpdate}
        />
      ))}

      {addingWorkout ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-2 border border-pink-100">
          <input
            autoFocus
            type="text"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddWorkout();
              if (e.key === "Escape") { setAddingWorkout(false); setNewWorkoutName(""); }
            }}
            placeholder="Nome do novo treino (ex: Treino A)"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={handleAddWorkout}
            disabled={savingNewWorkout || !newWorkoutName.trim()}
            className="px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium disabled:opacity-60 hover:bg-pink-700 transition"
          >
            {savingNewWorkout ? "..." : "Adicionar"}
          </button>
          <button
            onClick={() => { setAddingWorkout(false); setNewWorkoutName(""); }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddingWorkout(true)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-pink-300 text-pink-600 font-medium hover:bg-pink-50 transition"
        >
          + Adicionar Treino
        </button>
      )}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab({
  sheet,
  onUpdate,
  allUsers,
}: {
  sheet: WorkoutSheet;
  onUpdate: (s: WorkoutSheet) => void;
  allUsers: User[];
}) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [linking, setLinking] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const linkedUserIds = new Set(sheet.WorkoutSheetUsers.map((wsu) => wsu.userId));
  const availableUsers = allUsers.filter(
    (u) => !linkedUserIds.has(u.id) && u.role !== "admin"
  );

  const handleLink = async () => {
    if (!selectedUserId) return;
    setLinking(true);
    try {
      await linkSheetToUser({ userId: selectedUserId, workoutSheetId: sheet.id });
      const user = allUsers.find((u) => u.id === selectedUserId)!;
      const newWsu: WorkoutSheetUser = {
        userId: user.id,
        workoutSheetId: sheet.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          companyId: user.companyId,
        },
      };
      onUpdate({ ...sheet, WorkoutSheetUsers: [...sheet.WorkoutSheetUsers, newWsu] });
      setSelectedUserId("");
      toast.success("Usuário vinculado à ficha!");
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message ?? "Erro ao vincular usuário.");
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = async (userId: string) => {
    if (!confirm("Desvincular este usuário da ficha?")) return;
    setUnlinkingId(userId);
    try {
      await unLinkSheetToUser({ userId, workoutSheetId: sheet.id });
      onUpdate({
        ...sheet,
        WorkoutSheetUsers: sheet.WorkoutSheetUsers.filter((wsu) => wsu.userId !== userId),
      });
      toast.success("Usuário desvinculado.");
    } catch {
      toast.error("Erro ao desvincular usuário.");
    } finally {
      setUnlinkingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add user */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Vincular novo usuário</h3>
        {availableUsers.length === 0 ? (
          <p className="text-sm text-gray-400">Todos os usuários já estão vinculados a esta ficha.</p>
        ) : (
          <div className="flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            >
              <option value="">Selecione um usuário...</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.username})
                </option>
              ))}
            </select>
            <button
              onClick={handleLink}
              disabled={linking || !selectedUserId}
              className="px-4 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 disabled:opacity-60 transition"
            >
              {linking ? "Vinculando..." : "Vincular"}
            </button>
          </div>
        )}
      </div>

      {/* Current users */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Usuários vinculados ({sheet.WorkoutSheetUsers.length})
          </h3>
        </div>

        {sheet.WorkoutSheetUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhum usuário vinculado a esta ficha.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sheet.WorkoutSheetUsers.map((wsu) => (
              <li
                key={wsu.userId}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{wsu.user.name}</p>
                  <p className="text-xs text-gray-400">
                    @{wsu.user.username} • Vinculado em{" "}
                    {new Date(wsu.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleUnlink(wsu.userId)}
                  disabled={unlinkingId === wsu.userId}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition opacity-0 group-hover:opacity-100"
                  title="Desvincular usuário"
                >
                  <IconUserMinus />
                  {unlinkingId === wsu.userId ? "..." : "Desvincular"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EditWorkoutSheetPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { refreshSheets } = useWorkoutSheets();

  const [sheet, setSheet] = useState<WorkoutSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const load = useCallback(async () => {
    try {
      const [sheetData, usersData] = await Promise.all([
        getWorkoutSheetById(id),
        listUsers(),
      ]);
      setSheet(sheetData);
      setAllUsers(usersData);
    } catch {
      toast.error("Erro ao carregar ficha de treino.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => {
    refreshSheets();
    router.push("/workout-sheets");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Carregando ficha...</div>
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Ficha não encontrada.</p>
        <button onClick={handleBack} className="text-pink-600 underline text-sm">
          Voltar para fichas
        </button>
      </div>
    );
  }

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: "info", label: "Informações" },
    { key: "workouts", label: "Treinos", count: sheet.workouts.length },
    { key: "users", label: "Usuários", count: sheet.WorkoutSheetUsers.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-16">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <button
            onClick={handleBack}
            className="mt-1 p-2 rounded-full hover:bg-pink-100 text-pink-600 transition flex-shrink-0"
            aria-label="Voltar"
          >
            <IconBack />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 truncate">{sheet.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                  sheet.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {sheet.isActive ? "Ativa" : "Inativa"}
              </span>
              <span className="text-xs text-gray-400">
                {sheet.type === "default" ? "Padrão" : "Personalizada"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-pink-100/50 p-1 rounded-2xl mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    activeTab === tab.key
                      ? "bg-pink-100 text-pink-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "info" && (
          <InfoTab sheet={sheet} onUpdate={setSheet} />
        )}
        {activeTab === "workouts" && (
          <WorkoutsTab sheet={sheet} onUpdate={setSheet} />
        )}
        {activeTab === "users" && (
          <UsersTab sheet={sheet} onUpdate={setSheet} allUsers={allUsers} />
        )}
      </div>
    </div>
  );
}
