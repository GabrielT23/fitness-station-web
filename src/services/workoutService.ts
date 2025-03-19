import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

export interface Workout {
  id: string;
  name: string;
  workoutSheetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutRequest {
  name: string;
  workoutSheetId: string;
}

export async function createWorkout(data: CreateWorkoutRequest): Promise<Workout> {
  const response = await api.post<Workout>("/workouts", data);
  return response.data;
}

export async function listWorkouts(): Promise<Workout[]> {
  const response = await api.get<Workout[]>("/workouts");
  return response.data;
}

export async function getWorkoutById(id: string): Promise<Workout> {
  const response = await api.get<Workout>(`/workouts/${id}`);
  return response.data;
}

export async function updateWorkout(id: string, data: Partial<CreateWorkoutRequest>): Promise<Workout> {
  const response = await api.patch<Workout>(`/workouts/${id}`, data);
  return response.data;
}

export async function deleteWorkout(id: string): Promise<void> {
  await api.delete(`/workouts/${id}`);
}