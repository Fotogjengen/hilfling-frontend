import { api } from "./api";

interface AuthToken {
  token: string;
}

export const AuthApi = {
  /**
   * Logs a user in by fetching the session token from the backend
   */
  login: async function (
    username: string,
    password: string,
  ): Promise<AuthToken> {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);

    const response = await api.post<AuthToken>(
      "/auth/login",
      {},
      { headers: { Authorization: basicAuth } },
    );

    return response.data;
  },
};
