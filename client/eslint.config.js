// eslint.config.ts
// -----------------------------------------------------------------------------
// This file configures ESLint for a TypeScript + React project using modern,
// modular ESLint config syntax (enabled via `typescript-eslint` v6+).
//
// ESLint is a static analysis tool that catches syntax errors, enforces
// best practices, and improves code consistency across the codebase.
//
// Key plugins and settings included:
// - `typescript-eslint`: Adds TypeScript support and recommended rules
// - `react-hooks`: Ensures correct use of React hooks
// - `react-refresh`: Helps prevent bugs when using fast-refresh (e.g., in Vite)
// - `globals`: Declares global variables like `window`, `document`, etc.
// -----------------------------------------------------------------------------

// Base recommended ESLint rules for plain JavaScript
import js from '@eslint/js'

// Provides global browser variables (e.g., window, document)
import globals from 'globals'

// ESLint plugin to enforce React hooks rules (e.g., useEffect dependencies)
import reactHooks from 'eslint-plugin-react-hooks'

// Plugin that warns if fast-refreshable components are improperly exported
import reactRefresh from 'eslint-plugin-react-refresh'

// Main TypeScript + ESLint integration toolkit
import tseslint from 'typescript-eslint'

// Export the ESLint config using typescript-eslint's modular config format
export default tseslint.config(
  // Config block 1: General project-wide settings
  {
    // Tell ESLint to ignore the `dist` directory (build output)
    ignores: ['dist'],
  },

  // Config block 2: Specific rules for TypeScript + React files
  {
    // Extend base JS and TypeScript recommended ESLint rules
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    // Target TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],

    // Language-level configuration
    languageOptions: {
      ecmaVersion: 2020,          // Use modern ECMAScript features
      globals: globals.browser,   // Enable browser globals like `window`, `console`, etc.
    },

    // Register ESLint plugins
    plugins: {
      'react-hooks': reactHooks,     // For enforcing hook rules
      'react-refresh': reactRefresh, // For guarding against fast-refresh edge cases
    },

    // Add specific rules
    rules: {
      // Spread in recommended rules for hooks (e.g., no missing deps in useEffect)
      ...reactHooks.configs.recommended.rules,

      // Warn if a React component doesn't follow fast-refresh rules (e.g., exporting functions conditionally)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Allow `const MyComponent = () => {}` to be exported
      ],
    },
  },
)
