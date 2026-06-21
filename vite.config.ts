// vite.config.ts
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import http from "node:http";
import path from "node:path";

const BACKEND = "http://localhost:8000";
const DJANGO = "http://localhost:8888";

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
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    djangoPhotoDeleteProxy(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
              proxyReq.setHeader("X-Samfundet-Remote-User", username);
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
