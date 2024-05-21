import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
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
        find: '@routes',
        replacement: '/src/routes',
      },
      {
        find: '@types',
        replacement: '/src/types',
      },
    ],
  },
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
});
