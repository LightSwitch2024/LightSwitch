import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src',
      },
      {
        find: '@api',
        replacement: '/src/api',
      },
      {
        find: '@assets',
        replacement: '/src/assets',
      },
      {
        find: '@components',
        replacement: '/src/components',
      },
      {
        find: '@global',
        replacement: '/src/global',
      },
      {
        find: '@hooks',
        replacement: '/src/hooks',
      },
      {
        find: '@pages',
        replacement: '/src/pages',
      },
      {
        find: '@router',
        replacement: '/src/router',
      },
    ],
  },
});
