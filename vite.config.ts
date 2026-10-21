// vite.config.ts
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import http from "node:http";
import path from "node:path";
import { execSync } from "node:child_process";

const BACKEND = "http://localhost:8000";
const DJANGO = "http://localhost:8888";

function getGitCommitHash(): string | undefined {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch {
    return undefined;
  }
}

function getGitBranch(): string | undefined {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    return undefined;
  }
}

const sentryRelease = getGitCommitHash();
const currentBranch = getGitBranch();
const isProductionBranch =
  currentBranch === "master" || currentBranch === "main";

// Mimck itk auth challenge.
// 100% chat, bryr meg ikke
function itkAuthChallengeProxy(): PluginOption {
  const challenge = (res: http.ServerResponse) => {
    res.statusCode = 401;
    res.setHeader(
      "WWW-Authenticate",
      'Basic realm="Samfundet", charset="UTF-8"',
    );
    res.end();
  };

  const isClearingCredentials = (authHeader: string) =>
    authHeader.startsWith("Basic ") &&
    Buffer.from(authHeader.slice(6), "base64").toString() === "logme:out";

  return {
    name: "itk-auth-challenge-proxy",
    configureServer(server) {
      server.middlewares.use("/api/auth/login", (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          challenge(res);
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (isClearingCredentials(authHeader)) {
          challenge(res);
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  build: {
    sourcemap: true,
  },
  define: {
    __SENTRY_RELEASE__: JSON.stringify(sentryRelease),
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    itkAuthChallengeProxy(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      url: process.env.SENTRY_URL || "https://sentry.klve.no",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      release:
        isProductionBranch && sentryRelease
          ? {
              name: sentryRelease,
              setCommits: {
                auto: true,
              },
            }
          : undefined,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // photos from the photo provider
      "/media": { target: DJANGO, changeOrigin: true },

      // photo upload
      "/api/photos/upload": {
        target: DJANGO,
        changeOrigin: true,
      },

      "/api/user-uploads/upload": {
        target: DJANGO,
        changeOrigin: true,
      },

      // auth: mimic ITK auth
      "/api/auth": {
        target: BACKEND,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const authHeader = proxyReq.getHeader("authorization");
            if (
              typeof authHeader === "string" &&
              authHeader.startsWith("Basic ")
            ) {
              const decoded = Buffer.from(
                authHeader.slice(6),
                "base64",
              ).toString();
              const username = decoded.split(":")[0];
              const path = proxyReq.path;
              // append domain for the ITK login endpoint
              const remoteUser =
                path === "/api/auth/login" || path === "/api/auth/login/"
                  ? `${username}@AD.SAMFUNDET.NO`
                  : username;
              proxyReq.setHeader("X-Samfundet-Remote-User", remoteUser);
            }
            proxyReq.removeHeader("authorization");
          });
        },
      },

      // everything  else goes to the backend
      "/api": { target: BACKEND, changeOrigin: true },
    },
  },
});
