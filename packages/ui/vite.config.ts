import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [solid({ ssr: true })],
  build: {
    target: "esnext",
    outDir: isSsrBuild ? "dist/server" : "dist/client",
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    ssr: isSsrBuild ? true : undefined,
    lib: {
      entry: { index: "src/index.ts" },
      formats: ["es"],
    },
    rollupOptions: {
      // The plugin tags SSR modules with a `$$moduleUrl` export for app-level lazy();
      // re-exporting them from the barrel collides harmlessly. Library output doesn't need it.
      onwarn(warning, warn) {
        if (
          warning.code === "NAMESPACE_CONFLICT" &&
          warning.message.includes("$$moduleUrl")
        )
          return;
        warn(warning);
      },
      external: [/^solid-js/, /^@solidjs\//, /^@floating-ui\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
}));
