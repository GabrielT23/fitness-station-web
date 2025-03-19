import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  muscleGroup: string;
  restPeriod: number;
  videoLink?: string;
  workoutId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  workoutSheetId: string;
  createdAt: string;
  updatedAt: string;
  exercises: Exercise[];
}

export interface WorkoutSheetUser {
  userId: string;
  workoutSheetId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    companyId: string;
  };
}

export interface WorkoutSheet {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  workouts: Workout[];
  WorkoutSheetUsers: WorkoutSheetUser[];
}

export interface LinkSheetToUserRequest {
  userId: string;
  workoutSheetId: string;
}

export interface CreateWorkoutSheetRequest {
  name: string;
  type: string;
  isActive: boolean;
  companyId: string;
  users?: { id: string }[];
  workouts?: {
    name: string;
    exercises: {
      name: string;
      reps: number;
      sets: number;
      muscleGroup: string;
      restPeriod: number;
      videoLink?: string;
    }[];
  }[];
}

export async function createWorkoutSheet(data: CreateWorkoutSheetRequest): Promise<WorkoutSheet> {
  const response = await api.post<WorkoutSheet>("/workoutSheets", data);
  return response.data;
}

export async function listWorkoutSheets(): Promise<WorkoutSheet[]> {
  const response = await api.get<WorkoutSheet[]>("/workoutSheets");
  return response.data;
}

export async function listWorkoutSheetsClient(): Promise<WorkoutSheet[]> {
  const response = await api.get<WorkoutSheet[]>("/workoutSheets/client");
  return response.data;
}

export async function getWorkoutSheetById(id: string): Promise<WorkoutSheet> {
  const response = await api.get<WorkoutSheet>(`/workoutSheets/${id}`);
  return response.data;
}

export async function updateWorkoutSheet(id: string, data: Partial<CreateWorkoutSheetRequest>): Promise<WorkoutSheet> {
  const response = await api.put<WorkoutSheet>(`/workoutSheets/${id}`, data);
  return response.data;
}

export async function linkSheetToUser(data: LinkSheetToUserRequest): Promise<void> {
  await api.post("/workoutSheets/link-sheet-user", data);
}

export async function unLinkSheetToUser(data: LinkSheetToUserRequest): Promise<void> {
  await api.post("/workoutSheets/unlink-sheet-user", data);
}

export async function deleteWorkoutSheet(id: string): Promise<void> {
  await api.delete(`/workoutSheets/${id}`);
}