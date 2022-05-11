import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRefresh from "@vitejs/plugin-react-refresh";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [
    react(),
    reactRefresh(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
  ],
  esbuild: {},
  define: {
    global: "window",
    "process.env": {},
  },
  resolve: {
    alias: {
      util: "util",
      process: "process/browser",
    },
  },
});
