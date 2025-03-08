import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom", // Simulates a browser environment
    setupFiles: "./setupTests.js", // Global setup for testing
  },
});
