"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import _ReactPlayer, { ReactPlayerProps } from 'react-player';
import { getWorkoutSheetById } from "@/services/workoutSheetService";
import { listWorkouts } from "@/services/workoutService";
import { listExercises } from "@/services/exerciseService";


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
  const params = useParams();
  const { id } = params; // id da ficha de treino
  const [sheet, setSheet] = useState<WorkoutSheet | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca os detalhes da ficha de treino
        const sheetData = await getWorkoutSheetById(id as string);
        setSheet(sheetData);

        // Busca os treinos e filtra os que pertencem à ficha
        const workoutsData = await listWorkouts();
        const filteredWorkouts = workoutsData.filter(
          (workout: Workout) => workout.workoutSheetId === id
        );
        setWorkouts(filteredWorkouts);
        if (filteredWorkouts.length > 0) {
          setActiveWorkoutId(filteredWorkouts[0].id);
        }

        // Busca todos os exercícios
        const exercisesData = await listExercises();
        setExercises(exercisesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, [id]);

  // Filtra os exercícios do treino ativo
  const activeExercises = exercises.filter(
    (exercise) => exercise.workoutId === activeWorkoutId
  );

  return (
    <div className="p-8">
      {sheet ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{sheet.name}</h1>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Treinos</h2>
            {/* Menu de tabs responsivo */}
            <div className="flex space-x-4 overflow-x-auto pb-2 border-b">
              {workouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => setActiveWorkoutId(workout.id)}
                  className={`px-4 py-2 whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    activeWorkoutId === workout.id
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {workout.name}
                </button>
              ))}
            </div>

            {/* Lista de exercícios para o treino ativo */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Exercícios</h3>
              {activeExercises.length > 0 ? (
                <ul className="space-y-4">
                  {activeExercises.map((exercise) => (
                    <AccordionExercise key={exercise.id} exercise={exercise} />
                  ))}
                </ul>
              ) : (
                <p>Nenhum exercício encontrado para este treino.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Carregando ficha de treino...</p>
      )}
    </div>
  );
}

// Componente Accordion para cada exercício
// Componente Accordion para cada exercício
interface AccordionExerciseProps {
  exercise: Exercise;
}

const muscleGroupTranslations: Record<string, string> = {
  CHEST: "Peito",
  BACK: "Costas",
  LEGS: "Pernas",
  SHOULDERS: "Ombros",
  ARMS: "Braços",
  CORE: "Core",
};

function AccordionExercise({ exercise }: AccordionExerciseProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-bold">{exercise.name}</span>
        <span className="text-sm text-gray-500">
          {exercise.reps} repetições
        </span>
      </button>
      {isOpen && (
        <div className="px-4 py-2 border-t">
          <p>
            <strong>Séries:</strong> {exercise.sets}
          </p>
          <p>
            <strong>Grupo muscular:</strong>{" "}
            {muscleGroupTranslations[exercise.muscleGroup] || exercise.muscleGroup}
          </p>
          <p>
            <strong>Descanso:</strong> {exercise.restPeriod} segundos
          </p>
          {exercise.videoLink && (
            <div className="mt-2">
              <ReactPlayer
                key={exercise.id}
                light
                url={exercise.videoLink}
                className="rounded-[1rem] overflow-hidden max-w-[275px] max-h-[150px] z-[1] 
         [@media(min-width:500px)]:max-w-[342px] [@media(min-width:500px)]:max-h-[190px]
         md:max-w-[400px] md:max-h-[222px] 
         lg:max-w-[504px] lg:max-h-[280px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
