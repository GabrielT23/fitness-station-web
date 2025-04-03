import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  lastPayment?: string
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role?: string;
  companyId: string;
}


export interface EditUserRequest {
  name?: string;
  username?: string;
  password?: string;
  role?: string;
  companyId: string;
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const response = await api.post<User>("/users", data);
  return response.data;
}

export async function listUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: string, data: Partial<CreateUserRequest>): Promise<User> {
  const response = await api.patch<User>(`/users/${id}`, data);
  return response.data;
}

export async function setPayment(id: string): Promise<User> {
  const response = await api.patch<User>(`/users/set-payment/${id}`);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}