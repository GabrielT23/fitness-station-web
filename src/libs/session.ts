import Cookies from "js-cookie";

/** Cookies that make up the client session. Keep in sync with middleware.ts. */
export const SESSION_COOKIES = [
  "access_token",
  "refresh_token",
  "userId",
  "user_type",
  "companyId",
] as const;

/** Lifetime of the session cookies, in days. Matches the refresh token lifetime (60 days, sliding). */
const SESSION_DAYS = 60;

function cookieOptions() {
  return {
    expires: SESSION_DAYS,
    sameSite: "lax" as const,
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
    path: "/",
  };
}

export interface SessionUpdate {
  access_token?: string | null;
  refresh_token?: string | null;
  role?: string | null;
  userId?: string | null;
  companyId?: string | null;
}

/**
 * Writes the session cookies with a persistent expiry.
 * Only the fields provided are written, so a token refresh can update the tokens alone.
 */
export function setSession(session: SessionUpdate): void {
  const options = cookieOptions();
  const values: Record<(typeof SESSION_COOKIES)[number], string | null | undefined> = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user_type: session.role,
    userId: session.userId,
    companyId: session.companyId,
  };

  for (const name of SESSION_COOKIES) {
    const value = values[name];
    if (value !== undefined && value !== null) {
      Cookies.set(name, String(value), options);
    }
  }
}

/** Removes every session cookie. */
export function clearSession(): void {
  for (const name of SESSION_COOKIES) {
    Cookies.remove(name, { path: "/" });
  }
}
