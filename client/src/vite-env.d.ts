/// <reference types="vite/client" />
// -----------------------------------------------------------------------------
// vite-env.d.ts
//
// This is a TypeScript declaration file that tells the TypeScript compiler to
// include type definitions for Vite's special features (like import.meta.env).
//
// Why it's needed:
// - Vite exposes environment variables like `import.meta.env.VITE_API_KEY`
// - TypeScript doesn't recognize these Vite-specific types unless they're imported
// - This reference directive pulls in those types from `vite/client`
//
// Usage in this project:
// - Used in files like `App.tsx`, where Vite environment variables are accessed:
//     e.g., import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//
// This file ensures that TypeScript understands Vite's custom `import.meta.env`
// object structure so you get proper type-checking and editor autocomplete.
//
// Do not remove or rename this file — it supports essential tooling for Vite + TypeScript projects.
// -----------------------------------------------------------------------------
