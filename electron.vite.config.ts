import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: [/^node:.*/]
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [
      react(),
      TanStackRouterVite({
        generatedRouteTree: resolve(__dirname, 'src/renderer/src/routeTree.gen.ts'),
        routesDirectory: resolve(__dirname, 'src/renderer/src/routes')
      })
    ]
  }
});
