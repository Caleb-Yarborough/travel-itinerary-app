// vite.config.ts
// -----------------------------------------------------------------------------
// This is the main configuration file for Vite, a fast frontend build tool
// used to power the React + TypeScript frontend of the AI Travel Itinerary App.
//
// This config:
// - Adds React support via the `@vitejs/plugin-react` plugin
// - Defines a custom `@` path alias for simpler imports
// - Specifies the build output directory
// - Configures the dev server (port 3000, host accessible)
// - Sets the base path for static hosting on Fly.io
//
// Vite is known for fast startup, hot module reloading, and zero-config builds.
// -----------------------------------------------------------------------------

import { fileURLToPath } from 'url';     // Helps convert import.meta.url to file path
import path from 'path';                // Node.js path utilities
import { defineConfig } from 'vite';    // Vite's configuration helper
import react from '@vitejs/plugin-react'; // Enables React support (JSX, Fast Refresh, etc.)

// ------------------- ESM __dirname Compatibility -------------------
// Vite config is in ESM format (no `__dirname` by default), so we generate it manually:
const __filename = fileURLToPath(import.meta.url); // Full path to this file
const __dirname = path.dirname(__filename);        // Extract the directory name

// ------------------------ Vite Configuration ------------------------
export default defineConfig({
  // Enable React features and optimizations (Fast Refresh, HMR)
  plugins: [react()],

  // Define path aliases to simplify imports (e.g., import x from '@/components/x')
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Configure output directory for production builds
  build: {
    outDir: 'dist', // Output folder for `npm run build`
  },

  // Development server config
  server: {
    host: true,     // Allow external access (useful in Docker or Fly.io)
    port: 3000,     // Local dev server runs at http://localhost:3000
  },

  // Set the base path for deploying to Fly.io or any static host
  // Ensures asset URLs resolve correctly in production
  base: '/',
});
