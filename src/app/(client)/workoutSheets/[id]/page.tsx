"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import _ReactPlayer, { ReactPlayerProps } from 'react-player';
import { getWorkoutSheetById } from "@/services/workoutSheetService";
import { listWorkouts } from "@/services/workoutService";
import { listExercises } from "@/services/exerciseService";
import Image from "next/image";
import Logo from "../../../../assets/logo.png";

interface WorkoutSheet {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface Workout {
  id: string;
  name: string;
  workoutSheetId: string;
  createdAt: string;
  updatedAt: string;
}

interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  muscleGroup: string;
  restPeriod: number;
  videoLink: string;
  workoutId: string;
  createdAt: string;
  updatedAt: string;
}

const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;

export default function WorkoutSheetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sheet, setSheet] = useState<WorkoutSheet | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const sheetData = await getWorkoutSheetById(id! as string);
        setSheet(sheetData);

        const workoutsData = await listWorkouts();
        const filtered = workoutsData.filter(w => w.workoutSheetId === id);
        setWorkouts(filtered);
        if (filtered.length) setActiveWorkoutId(filtered[0].id);

        const exercisesData = await listExercises();
        setExercises(exercisesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, [id]);

  const activeExercises = exercises.filter(ex => ex.workoutId === activeWorkoutId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-pink-600">Fitness Station</h1>
        </div>
        <button
          onClick={() => router.push("/workoutSheets")}
          className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition"
        >
          Voltar
        </button>
      </header>

      <main className="p-8">
        {sheet ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{sheet.name}</h2>
            <p className="text-gray-600 mb-6">
              Tipo: <span className="font-medium">{sheet.type}</span> | Status:{" "}
              <span className={sheet.isActive ? "text-green-600" : "text-red-600"}>
                {sheet.isActive ? "Ativa" : "Inativa"}
              </span>
            </p>

            {/* Tabs */}
            <div className="flex space-x-4 overflow-x-auto pb-2 border-b border-pink-200">
              {workouts.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWorkoutId(w.id)}
                  className={`px-4 py-2 whitespace-nowrap border-b-2 transition ${
                    activeWorkoutId === w.id
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>

            {/* Exercises */}
            <section className="mt-8 space-y-4">
              {activeExercises.length ? (
                activeExercises.map((ex) => (
                  <AccordionExercise key={ex.id} exercise={ex} />
                ))
              ) : (
                <p className="text-gray-500">Nenhum exercício para este treino.</p>
              )}
            </section>
          </>
        ) : (
          <p className="text-gray-600">Carregando ficha de treino...</p>
        )}
      </main>
    </div>
  );
}

interface AccordionExerciseProps { exercise: Exercise }

const muscleGroupTranslations: Record<string, string> = {
  CHEST: "Peito",
  BACK: "Costas",
  LEGS: "Pernas",
  SHOULDERS: "Ombros",
  ARMS: "Braços",
  CORE: "Core",
};

function AccordionExercise({ exercise }: AccordionExerciseProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
      >
        <span className="font-semibold text-gray-800">{exercise.name}</span>
        <span className="text-sm text-gray-500">{exercise.reps} reps</span>
      </button>
      {open && (
        <div className="px-6 py-4 border-t border-pink-100 bg-pink-50">
          <p><strong>Séries:</strong> {exercise.sets}</p>
          <p>
            <strong>Grupo:</strong>{" "}
            {muscleGroupTranslations[exercise.muscleGroup] || exercise.muscleGroup}
          </p>
          <p><strong>Descanso:</strong> {exercise.restPeriod}s</p>
          {exercise.videoLink && (
            <div className="mt-4 flex justify-center">
              <ReactPlayer
                url={exercise.videoLink}
                light
                className="rounded-xl overflow-hidden max-w-full"
                height="200px"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
