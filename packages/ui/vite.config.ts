import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";

// The package ships uncompiled Solid source (see `build:source`); consumers compile it with
// their own Vite. This config only serves local tooling such as tests.
export default defineConfig({
  plugins: [solid({ ssr: true })],
});
