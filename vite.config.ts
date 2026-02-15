import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, copyFileSync, mkdirSync } from "fs";

const ciPagesUrl = process.env.CI_PAGES_URL;
const base = ciPagesUrl ? new URL(ciPagesUrl).pathname : "/";

export default defineConfig({
  base,
  build: {
    outDir: "dist",
  },
  plugins: [
    {
      name: "copy-screens",
      writeBundle() {
        const srcDir = resolve(__dirname, "src/screens");
        const destDir = resolve(__dirname, "dist/screens");
        mkdirSync(destDir, { recursive: true });
        for (const file of readdirSync(srcDir)) {
          copyFileSync(resolve(srcDir, file), resolve(destDir, file));
        }
      },
    },
  ],
});
