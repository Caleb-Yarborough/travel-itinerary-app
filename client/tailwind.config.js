/** @type {import('tailwindcss').Config} */
// -----------------------------------------------------------------------------
// This is the Tailwind CSS configuration file used to customize the behavior
// of the Tailwind framework in your project.
//
// Tailwind is used to apply utility classes directly in JSX/CSS (e.g., `p-4`,
// `text-center`, `bg-blue-500`). This file tells Tailwind:
// - Which files to scan for class names
// - How to extend the default design system (colors, fonts, spacing, etc.)
// - What plugins to use (e.g., typography plugin for prose formatting)
//
// Used automatically by PostCSS and Vite during development and build.
// -----------------------------------------------------------------------------

export default {
    // Tell Tailwind where to look for class names (HTML, JS, TS, JSX, TSX files)
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

    // Default theme settings (can be extended/customized here)
    theme: {
        extend: {}, // Placeholder for adding custom colors, fonts, spacing, etc.
    },

    // Plugins to include additional Tailwind features
    plugins: [
        // Adds typography utilities (e.g., styled <article> content with className="prose")
        require('@tailwindcss/typography'),
    ],
};
