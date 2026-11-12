import { AxiosError } from "axios";

/**
 * Returns the message sent by the API (e.g. "usuário já existente" or the list of
 * validation messages from the ValidationPipe), or the fallback when there is none.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const data = (error as AxiosError<{ message?: unknown }>).response?.data;
  const message = data?.message;

  if (Array.isArray(message)) {
    const texts = message.filter((m): m is string => typeof m === "string" && m.trim() !== "");
    if (texts.length > 0) return texts.join("; ");
  }
  if (typeof message === "string" && message.trim() !== "") {
    return message;
  }
  return fallback;
}
