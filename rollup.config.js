import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "main.ts",
    output: {
        dir: ".",
        sourcemap: "inline",
        format: "cjs",
        exports: "default"
    },
    external: [
        "obsidian",
        "electron",
    ],
    plugins: [
        typescript(),
        nodeResolve({ browser: true, preferBuiltins: true }),
        commonjs(),
    ]
}