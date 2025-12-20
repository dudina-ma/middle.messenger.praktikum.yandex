import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/pages/login/login.html'),
        signup: resolve(__dirname, 'src/pages/signup/signup.html'),
        chats: resolve(__dirname, 'src/pages/chats/chats.html'),
        profile: resolve(__dirname, 'src/pages/profile/profile.html'),
        error404: resolve(__dirname, 'src/pages/error404/error404.html'),
        error500: resolve(__dirname, 'src/pages/error500/error500.html'),
      }
    }
  }
}) 
