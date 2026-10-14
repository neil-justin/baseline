import path from "node:path";

/** Minimal shared config — mirrors tsconfig paths for vitest. */
export default {
  test: {
    environment: "node",
    include: ["scripts/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
};
