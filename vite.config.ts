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
const isProductionBranch = currentBranch === "master" || currentBranch === "main";

// api/photos/delete/{id} needs to go through the photo provider
function djangoPhotoDeleteProxy(): PluginOption {
  return {
    name: "django-photo-delete-proxy",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        // only DELETE /api/photos/<id>
        if (
          req.method !== "DELETE" ||
          !/^\/api\/photos\/[^/]+(\?|$)/.test(url)
        ) {
          next();
          return;
        }
        const proxyReq = http.request(
          {
            host: "localhost",
            port: 8888,
            method: "DELETE",
            path: url,
            headers: { ...req.headers, host: "localhost:8888" },
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
            proxyRes.pipe(res);
          },
        );
        proxyReq.on("error", (err) => {
          res.statusCode = 502;
          res.end(`Django delete proxy error: ${err.message}`);
        });
        req.pipe(proxyReq);
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
    djangoPhotoDeleteProxy(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      url: process.env.SENTRY_URL || "https://sentry.klve.no",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      release: isProductionBranch && sentryRelease
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
                path === "/auth/login" || path === "/auth/login/"
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
