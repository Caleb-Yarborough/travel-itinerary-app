// main.tsx
// -----------------------------------------------------------------------------
// This is the entry point for the React + Vite + TypeScript frontend.
// It initializes the React app and renders the <App /> component into the DOM.
//
// Key responsibilities:
// - Applies React 18's `createRoot` API for concurrent rendering
// - Uses `StrictMode` to enable extra warnings and checks during development
// - Loads global CSS styles for consistent styling
// - Mounts the app into the <div id="root"> defined in index.html
//
// This file is referenced in `index.html` via <script src="/src/main.tsx" type="module">
// -----------------------------------------------------------------------------

// Import StrictMode, a tool for highlighting potential problems in React code
import { StrictMode } from 'react';

// Import the createRoot function to initialize the React app (React 18+ API)
import { createRoot } from 'react-dom/client';

// Import global CSS styles for the application
import './index.css';

// Import the main App component that represents the whole application UI
import App from './App.tsx';

// Find the HTML element with the ID 'root' and mount the React app into it
// The exclamation mark (!) asserts that the element definitely exists
createRoot(document.getElementById('root')!).render(
  // Wrap the App in StrictMode to enable additional checks and warnings in development
  <StrictMode>
    <App />
  </StrictMode>,
);
