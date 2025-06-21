import base from "../../vitest.config";
import { defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default mergeConfig(
  base,
  defineConfig({
    plugins: [react(), tsconfigPaths()],
  }),
);
