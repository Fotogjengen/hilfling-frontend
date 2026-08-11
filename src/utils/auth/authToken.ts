// auth token store

import Cookies from "js-cookie";

const TOKEN_COOKIE = "fgToken";

export function getToken(): string | null {
  return Cookies.get(TOKEN_COOKIE) ?? null;
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_COOKIE, token, {
    expires: 1,
    sameSite: "lax",
    secure: import.meta.env.PROD,
  });
}

export function clearToken(): void {
  Cookies.remove(TOKEN_COOKIE);
}
