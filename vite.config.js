import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/pages/login/login.html')
      }
    }
  },
  plugins: [handlebars({
    partialDirectory: resolve(__dirname, 'src/components/partials'),
    context: {
      title: 'Praktikum Messenger',
    },
  })],
}) 