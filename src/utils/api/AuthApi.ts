import { api } from "./api";
import { AuthToken } from "@/interfaces/AuthToken";

export const AuthAPi = {
  login: async function (
    username: string,
    password: string,
  ): Promise<AuthToken> {
    const basicAuth = "Basic " + btoa(username + ":" + password);

    const response = await api.post<AuthToken>(
      "/auth/login",
      {},
      {
        headers: {
          Authorization: basicAuth,
        },
      },
    );

    console.log("Login response:", response.data);

    return response.data;
  },
};
