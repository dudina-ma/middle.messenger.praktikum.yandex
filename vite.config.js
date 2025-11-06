import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { chatsData } from './src/mock/chatsData.ts';
import { dialogData } from './src/mock/dialogData.ts';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    port: 3000,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/pages/login/login.html'),
        chats: resolve(__dirname, 'src/pages/chats/chats.html')
      }
    }
  },
  plugins: [handlebars({
    partialDirectory: resolve(__dirname, 'src/components/partials'),
    context: {
      title: 'Praktikum Messenger',
      chats: chatsData,
      dialog: dialogData,
    },
  })],
}) 
