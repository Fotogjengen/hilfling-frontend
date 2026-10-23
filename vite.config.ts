// vite.config.ts
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import http from "node:http";
import path from "node:path";

const BACKEND = "http://localhost:8000";
const DJANGO = "http://localhost:8888";

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
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    itkAuthChallengeProxy(),
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
