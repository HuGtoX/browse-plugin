import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/popup/main.tsx", "src/options/main.tsx","src/worker.ts", "src/scripts/*.ts"],
  outDir: "dist", // 输出目录
  format: ["iife"], // 输出格式
  jsx: "react-jsx", // 支持 React 17+ 的 JSX 转换
  target: "es2020", // 目标环境
  clean: true, // 构建前清理输出目录
  bundle: true,
  outExtension() {
    return {
      js: `.js`,
    };
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [],
});
