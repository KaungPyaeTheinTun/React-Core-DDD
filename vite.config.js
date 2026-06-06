import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // <-- 1. Make sure this is imported

export default defineConfig({
  plugins: [
    react(), // <-- 2. Make sure this function is executed in the plugins array
  ],
});
