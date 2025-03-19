import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

export interface Exercise {
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

export interface CreateExerciseRequest {
  name: string;
  reps: number;
  sets: number;
  muscleGroup: string;
  restPeriod: number;
  videoLink: string;
  workoutId: string;
}

export async function createExercise(data: CreateExerciseRequest): Promise<Exercise> {
  const response = await api.post<Exercise>("/exercises", data);
  return response.data;
}

export async function listExercises(): Promise<Exercise[]> {
  const response = await api.get<Exercise[]>("/exercises");
  return response.data;
}

export async function getExerciseById(id: string): Promise<Exercise> {
  const response = await api.get<Exercise>(`/exercises/${id}`);
  return response.data;
}

export async function updateExercise(id: string, data: Partial<CreateExerciseRequest>): Promise<Exercise> {
  const response = await api.patch<Exercise>(`/exercises/${id}`, data);
  return response.data;
}

export async function deleteExercise(id: string): Promise<void> {
  await api.delete(`/exercises/${id}`);
}