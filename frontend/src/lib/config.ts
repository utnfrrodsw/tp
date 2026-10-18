declare global {
  interface Window {
    _env_?: {
      VITE_BACKEND_URL?: string;
      VITE_WS_URL?: string;
    };
  }
}

const getEnv = (key: "VITE_BACKEND_URL" | "VITE_WS_URL"): string | undefined => {
  // 1. Runtime (Docker/nginx en producción)
  if (typeof window !== "undefined" && window._env_?.[key]) {
    return window._env_[key];
  }
  // 2. Build-time (pnpm dev / pnpm build local, lee .env.local)
  return import.meta.env[key];
};

export const BACKEND_URL = (
  getEnv("VITE_BACKEND_URL") ?? "http://localhost:3000"
).replace(/\/$/, "");

export const VITE_WS_URL = (
  getEnv("VITE_WS_URL") ?? "ws://localhost:3000"
).replace(/\/$/, "");

export default BACKEND_URL;