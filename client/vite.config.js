import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Read ports from server/.env — change them there, they apply everywhere
  const env = loadEnv(mode, resolve(__dirname, '../server'), '');
  const API_PORT = env.PORT || 5000;
  const DEV_PORT = env.DEV_PORT || 5173;

  return {
    plugins: [react()],
    build: {
      outDir: '../server/public',
      emptyOutDir: true,
    },
    server: {
      port: Number(DEV_PORT),
      proxy: {
        '/api': {
          target: `http://localhost:${API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});
