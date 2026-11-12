import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { clearSession, setSession } from "./session";

const REQUEST_TIMEOUT_MS = 15000;

/** Auth endpoints never trigger a refresh: a 401 there is an answer, not an expired token. */
const AUTH_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

/** Raised only when the server rejects the refresh token (or there is no session to refresh). */
export class SessionExpiredError extends Error {
  constructor() {
    super("Sessão expirada");
    this.name = "SessionExpiredError";
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * Single-flight refresh shared by every API instance. While one refresh is running,
 * other callers receive the same promise instead of calling /auth/refresh again.
 */
let inFlightRefresh: Promise<void> | null = null;

async function requestNewTokens(): Promise<void> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const refreshToken = Cookies.get("refresh_token");
  const userId = Cookies.get("userId");

  if (!baseURL || !refreshToken || !userId) {
    clearSession();
    throw new SessionExpiredError();
  }

  try {
    const { data } = await axios.post<{ access_token: string; refresh_token: string }>(
      `${baseURL}/auth/refresh`,
      { refreshToken, userId },
      { timeout: REQUEST_TIMEOUT_MS }
    );
    setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
  } catch (error) {
    const status = (error as AxiosError).response?.status;
    if (status === 401 || status === 403) {
      clearSession();
      throw new SessionExpiredError();
    }
    // Network error, timeout, 429 or 5xx: the session may still be valid, so keep the cookies.
    throw error;
  }
}

/** Renews the access token. Concurrent callers share one request. */
export function refreshSession(): Promise<void> {
  if (!inFlightRefresh) {
    const pending: Promise<void> = requestNewTokens().finally(() => {
      if (inFlightRefresh === pending) inFlightRefresh = null;
    });
    inFlightRefresh = pending;
  }
  return inFlightRefresh;
}

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export function setupAPIClient() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  if (!baseURL) {
    throw new Error("Não foi possível carregar API_BASE_URL");
  }

  const api = axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS });

  // Injeta o token atual em CADA requisição (não captura na criação da instância)
  api.interceptors.request.use((config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined;
      const isAuthEndpoint = AUTH_PATHS.some((path) => original?.url?.includes(path));

      if (!original || error.response?.status !== 401 || original._retry || isAuthEndpoint) {
        return Promise.reject(error);
      }
      original._retry = true;

      // Se outra requisição já renovou o token enquanto esta esperava, basta repetir.
      const sentToken = String(original.headers?.Authorization ?? "").replace(/^Bearer\s+/, "");
      const currentToken = Cookies.get("access_token") ?? "";
      const alreadyRenewed = currentToken !== "" && currentToken !== sentToken;

      try {
        if (!alreadyRenewed) {
          await refreshSession();
        }
      } catch (refreshError) {
        if (refreshError instanceof SessionExpiredError) {
          redirectToLogin();
        }
        // Erros de rede, 429 e 5xx não derrubam a sessão: só a requisição original falha.
        return Promise.reject(error);
      }

      return api.request(original);
    }
  );

  return api;
}
