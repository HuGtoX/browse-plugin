import React from "react";
import ReactDOM from "react-dom/client";
import HelloReact from "./components/Header";

// 确保 DOM 加载完成后再渲染
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<HelloReact />);
  }
});
