import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

export interface AssessmentSheet {
  id: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  altura?: number | null;
  peso?: number | null;
  bracoD?: number | null;
  bracoE?: number | null;
  antebracoD?: number | null;
  antebracoE?: number | null;
  bicepsD?: number | null;
  bicepsE?: number | null;
  torax1?: number | null;
  torax2?: number | null;
  cintura?: number | null;
  abdomen?: number | null;
  quadril?: number | null;
  coxaSupD?: number | null;
  coxaSupE?: number | null;
  coxaMedD?: number | null;
  coxaMedE?: number | null;
  coxaInfD?: number | null;
  coxaInfE?: number | null;
  pantD?: number | null;
  pantE?: number | null;
  imc?: number | null;
  gorduraPercent?: number | null;
  musculoPercent?: number | null;
  visceralFat?: number | null;
  idadeCorporal?: number | null;
  metabolismoBasal?: number | null;
}

export type AssessmentSheetFields = Omit<AssessmentSheet, "id" | "userId" | "createdAt" | "updatedAt">;

export interface CreateAssessmentRequest extends Partial<AssessmentSheetFields> {
  date: string;
  userId: string;
}

export type UpdateAssessmentRequest = Partial<AssessmentSheetFields>;

export async function createAssessmentSheet(data: CreateAssessmentRequest): Promise<AssessmentSheet> {
  const response = await api.post<AssessmentSheet>("/assessment-sheets", data);
  return response.data;
}

export async function listAssessmentSheets(): Promise<AssessmentSheet[]> {
  const response = await api.get<AssessmentSheet[]>("/assessment-sheets");
  return response.data;
}

export async function listAssessmentSheetsByUser(userId: string): Promise<AssessmentSheet[]> {
  const response = await api.get<AssessmentSheet[]>(`/assessment-sheets/user/${userId}`);
  return response.data;
}

export async function listMyAssessmentSheets(): Promise<AssessmentSheet[]> {
  const response = await api.get<AssessmentSheet[]>("/assessment-sheets/client");
  return response.data;
}

export async function getAssessmentSheetById(id: string): Promise<AssessmentSheet> {
  const response = await api.get<AssessmentSheet>(`/assessment-sheets/${id}`);
  return response.data;
}

export async function updateAssessmentSheet(id: string, data: UpdateAssessmentRequest): Promise<AssessmentSheet> {
  const response = await api.patch<AssessmentSheet>(`/assessment-sheets/${id}`, data);
  return response.data;
}

export async function deleteAssessmentSheet(id: string): Promise<void> {
  await api.delete(`/assessment-sheets/${id}`);
}
