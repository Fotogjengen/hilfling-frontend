/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8888";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("fgToken");
  if (token) {
    config.headers["X-hilfling-token"] = token;
  }

  const basicAuth = Cookies.get("fgBasicAuth");
  if (basicAuth) {
    config.headers["Authorization"] = `Basic ${basicAuth}`;
  }

  return config;
});
