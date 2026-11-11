import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { refreshSession, setupAPIClient } from "../libs/api";
import { clearSession } from "../libs/session";

const api = setupAPIClient();

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  role: string;
  userId: string;
  companyId: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}

/**
 * Revokes this device's session on the server (ignores errors, the local session is cleared anyway).
 * If the access token expired, it is renewed once so the revoke request can be authorized.
 */
async function revokeOnServer(): Promise<void> {
  const send = () =>
    api.post(
      "/auth/logout",
      { refreshToken: Cookies.get("refresh_token") ?? "" },
      { timeout: 5000 }
    );

  try {
    await send();
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      try {
        await refreshSession();
        await send();
      } catch {
        // Ignorado: o logout local acontece de qualquer forma.
      }
    }
  }
}

export async function logout(): Promise<void> {
  try {
    if (Cookies.get("refresh_token")) {
      await revokeOnServer();
    }
  } finally {
    clearSession();
  }
}
