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

/** Fields accepted by POST /users. The company comes from the logged admin on the API. */
export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role?: "admin" | "client";
}

/** Fields accepted by PATCH /users/:id. The API ignores role on update, so it is not sent. */
export interface EditUserRequest {
  name?: string;
  username?: string;
  password?: string;
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

export async function updateUser(id: string, data: EditUserRequest): Promise<User> {
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