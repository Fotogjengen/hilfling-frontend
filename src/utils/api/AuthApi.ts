import { api } from "./api";
import { AuthToken } from "@/interfaces/AuthToken";

export const AuthAPi = {
  login: async function (
    username: string,
    password: string,
  ): Promise<AuthToken> {
    //TODO: Vi må teste dette i produksjon :) Mye mulig vi må beholde en sånn dritt 401 challenge
    //som den gamle nettsiden.
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

    return response.data;
  },
};
