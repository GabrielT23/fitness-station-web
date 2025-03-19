import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

interface AxiosErrorResponse {
	status?: number;
	code?: string;
	message?: string;
}

export function setupAPIClient() {
	const cookieToken = Cookies.get("access_token");
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
			if (error.response?.status === 401) {
				Cookies.remove("token");
			}
			return Promise.reject(error);
		}
	);

	return api;
}
  

  
  