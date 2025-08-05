import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

interface AxiosErrorResponse {
  status?: number;
  code?: string;
  message?: string;
}

export function setupAPIClient() {
  const refreshToken = Cookies.get("refresh_token");
  const cookieToken = Cookies.get("access_token");
  const userId = Cookies.get("userId");

  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  if (!baseURL) {
    throw new Error("Não foi possível carregar API_BASE_URL");
  }

  const api = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${cookieToken || ""}`,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<AxiosErrorResponse>) => {
      // Se for erro de autenticação (token expirado)
      if (error.response?.status === 401) {
        try {
          if (!refreshToken) {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            window.location.href = "/login";
            return Promise.reject(error);
          }

          // Faz a requisição para refresh
          const refreshResponse = await axios.post(
            `${baseURL}/auth/refresh`,
            { refreshToken,
			  userId
			 }
          );

          const { access_token, refresh_token } = refreshResponse.data;

          // Atualiza os cookies
          Cookies.set("access_token", access_token);
          Cookies.set("refresh_token", refresh_token);
          // Atualiza o header da requisição original
          if (error.config && access_token) {
            if (error.config.headers && typeof error.config.headers.set === "function") {
              // AxiosHeaders (novo Axios)
              error.config.headers.set("Authorization", `Bearer ${access_token}`);
            } else if (error.config.headers) {
              // Objeto simples (Axios antigo)
              error.config.headers["Authorization"] = `Bearer ${access_token}`;
            }
            // Repete a requisição original
            return api.request(error.config);
          }
        } catch (refreshError) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      if (error.response?.status === 404) {
        Cookies.remove("access_token");
      }
      return Promise.reject(error);
    }
  );

  return api;
}
  

  
  