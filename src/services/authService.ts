import { setupAPIClient } from "../libs/api";

const api = setupAPIClient();

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: {  access_token: string;}
  role: string;
  userId: string;
  companyId: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}