import { api } from "./api";

interface AuthToken {
  token: string;
}

export const AuthApi = {
  /**
   * Logs a intern user in
   */
  login: async function (): Promise<AuthToken> {
    const response = await api.post<AuthToken>("/auth/login", {});

    return response.data;
  },
  loginExternal: async function (
    username: string,
    password: string,
  ): Promise<AuthToken> {
    const response = await api.post<AuthToken>("/auth/external-login", {
      username,
      password,
    });

    return response.data;
  },
};
