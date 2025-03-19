import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
}

export async function createCompany(data: CreateCompanyRequest): Promise<Company> {
  const response = await api.post<Company>("/companies", data);
  return response.data;
}

export async function listCompanies(): Promise<Company[]> {
  const response = await api.get<Company[]>("/companies");
  return response.data;
}

export async function getCompanyById(id: string): Promise<Company> {
  const response = await api.get<Company>(`/companies/${id}`);
  return response.data;
}

export async function updateCompany(id: string, data: CreateCompanyRequest): Promise<Company> {
  const response = await api.patch<Company>(`/companies/${id}`, data);
  return response.data;
}

export async function deleteCompany(id: string): Promise<void> {
  await api.delete(`/companies/${id}`);
}