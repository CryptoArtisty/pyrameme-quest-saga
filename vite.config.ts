//import { defineConfig } from "vite";
//import react from "@vitejs/plugin-react-swc";
//import path from "path";
//import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
//export default defineConfig(({ mode }) => ({
//  server: {
//    host: "::",
//    port: 8080,
//  },
//  plugins: [
//    react(),
//    mode === 'development' &&
//    componentTagger(),
//  ].filter(Boolean),
//  resolve: {
//    alias: {
//      "@": path.resolve(__dirname, "./src"),
//    },
//  },
//}));


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: '', // Deploy from root (for Vercel / GH Pages if needed)
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
})

