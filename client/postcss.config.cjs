// postcss.config.js
// -----------------------------------------------------------------------------
// This configuration file is used by PostCSS — a tool that processes CSS files
// before they are served or bundled. It's especially useful in modern frontend
// workflows with Tailwind CSS and other tools.
//
// In this project:
// - Tailwind CSS is used to provide utility-first styling
// - Autoprefixer adds vendor prefixes for cross-browser compatibility
//
// This config is automatically picked up by Vite during development and builds.
// -----------------------------------------------------------------------------

module.exports = {
  plugins: {
    // Enables Tailwind CSS features via PostCSS
    '@tailwindcss/postcss': {},

    // Adds vendor prefixes automatically (e.g., -webkit-, -moz-)
    // Ensures CSS works across different browsers
    autoprefixer: {},
  },
}
