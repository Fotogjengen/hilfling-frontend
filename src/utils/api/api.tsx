import axios from "axios";
import * as Sentry from "@sentry/react";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// report server errors (5xx) to Sentry. We should always report these, and they might get swallowed upstream
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: unknown = error?.response?.status;
    if (typeof status === "number" && status >= 500) {
      Sentry.captureException(error, {
        contexts: {
          response: {
            status_code: status,
            method: error?.config?.method,
            url: error?.config?.url,
          },
        },
      });
    }
    // re-throw the original error
    return Promise.reject(error as Error);
  },
);
