import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactSvgPlugin from "vite-plugin-react-svg";

export default defineConfig({
  plugins: [react(), reactSvgPlugin()],
  build: {
    sourcemap: "inline",
    minify: false,
    // Use Vite lib mode https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      formats: ["cjs"],
    },
    rollupOptions: {
      output: {
        // Overwrite default Vite output fileName
        entryFileNames: "main.js",
        assetFileNames: "styles.css",
      },
      external: ["obsidian"],
    },
    // Use root as the output dir
    emptyOutDir: false,
    outDir: ".",
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 1ee0305acdd4b7d27427d77bbf9c3d4e195b96fc
