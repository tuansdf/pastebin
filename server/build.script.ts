import { $ } from "bun";

await $`rm -rf dist`;

await Bun.build({
  entrypoints: ["./src/server.ts"],
  outdir: "./dist",
  target: "bun",
  sourcemap: "linked",
});

await $`cp -R resources dist/resources`;
await $`cp .env dist/`;
