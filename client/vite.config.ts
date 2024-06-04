import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import { fileURLToPath, URL } from "node:url";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      dirs: "src/pages", // Specify the directory for your pages
    }),
    Icons({
      compiler: "vue3",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@lib": fileURLToPath(new URL("./lib", import.meta.url)),
    },
  },
});
