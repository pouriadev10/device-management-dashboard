import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      // Only the route files, which are composition and metadata rather than
      // behaviour. Everything else is measured as it is, so the number stays
      // honest instead of being flattered by exclusions.
      exclude: ["src/app/**", "src/**/*.test.{ts,tsx}"],
      reporter: ["text", "html"],
    },
  },
});
