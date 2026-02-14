import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';
import checker from 'vite-plugin-checker';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [
    checker({
      typescript: {
        tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint .',
        dev: {
          logLevel: ['error', 'warning'],
        },
      },
      stylelint: {
        lintCommand: 'stylelint "**/*.{css,scss}"',
        dev: {
          logLevel: ['error', 'warning'],
        },
      },
    }),
  ],
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
      }
    }
  }
})
