import { build, emptyDir } from "jsr:@deno/dnt";

await emptyDir("./npm");

await build({
  importMap: "./deno.json",
  test: false,
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },

  compilerOptions: {
    lib: ["ESNext"],
  },

  package: {
    // package.json properties
    name: "@stansom/usher",
    author: "Stansom",
    version: Deno.args[0],
    description: "A simple routing library for JS/TS",
    license: "MIT",
    keywords: [
      "routing",
      "route",
      "router",
      "path",
      "url",
      "react",
      "node",
      "simple",
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/Stansom/usher-deno.git",
    },
    bugs: {
      url: "https://github.com/Stansom/usher-deno/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
