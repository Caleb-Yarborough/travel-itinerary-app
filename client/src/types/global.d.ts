// global.d.ts
// -----------------------------------------------------------------------------
// This is a TypeScript declaration file that extends the global `Window` object
// to include the `google` namespace from the Google Maps JavaScript API.
//
// Why it's needed:
// - The Google Maps API dynamically injects the `google` object into the window
// - TypeScript, by default, doesn't recognize `window.google`
// - Without this file, code like `(window as any).google.maps` would throw type errors
//
// Usage in this project:
// - Used in `LocationSearchInput.tsx`, `ItineraryForm.tsx`, and other files
//   where `window.google.maps` is accessed directly
// -----------------------------------------------------------------------------

// Ensures this file is treated as a module by TypeScript
export { };

// Extend the global `Window` interface to declare `google` as a known property
declare global {
    interface Window {
        google: typeof google; // Declare the Google Maps object globally
    }
}
