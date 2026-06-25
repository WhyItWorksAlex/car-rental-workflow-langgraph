import path from "node:path";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const src = path.resolve(__dirname, "src");

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ["./tsconfig.json"] })],
  resolve: {
    alias: {
      business: path.join(src, "business"),
      config: path.join(src, "config"),
      const: path.join(src, "const.ts"),
      graph: path.join(src, "graph"),
      llm: path.join(src, "llm"),
      router: path.join(src, "router"),
      schemas: path.join(src, "schemas"),
      tools: path.join(src, "tools"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
