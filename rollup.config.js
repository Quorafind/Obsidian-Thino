import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const isProd = env.BUILD === "production";

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    file: "main.js",
    exports: "default",
    sourcemap: "inline",
    sourcemapExcludeSources: isProd,
  },
  external: ["obsidian", "fs", "os", "path"],
  sourceMap: true,
  plugins: [
    less({options}),
    typescript(),
    resolve({
      browser: true,
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
    }),
    babel({
      presets: ["@babel/preset-react", "@babel/preset-typescript"],
    }),
    commonjs(),
  ],
};