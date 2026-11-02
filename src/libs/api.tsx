import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export function setupAPIClient() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  if (!baseURL) {
    throw new Error("Não foi possível carregar API_BASE_URL");
  }

  const api = axios.create({ baseURL });

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
      const originalRequest = error.config as typeof error.config & { _retry?: boolean };

      // Evita loop infinito de retentativas
      if (error.response?.status === 401 && !originalRequest?._retry) {
        if (originalRequest) originalRequest._retry = true;

        // Lê os cookies AGORA (valores mais recentes, não os capturados no início)
        const refreshToken = Cookies.get("refresh_token");
        const userId = Cookies.get("userId");

        if (!refreshToken || !userId) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          Cookies.remove("userId");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken,
            userId,
          });

          const { access_token, refresh_token } = refreshResponse.data;

          Cookies.set("access_token", access_token);
          Cookies.set("refresh_token", refresh_token);

          // Repete a requisição original — o request interceptor acima vai
          // usar o novo token que acabou de ser salvo no cookie
          return api.request(originalRequest!);
        } catch (refreshError) {
          const status = (refreshError as AxiosError).response?.status;
          if (status === 401 || status === 403) {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("userId");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
