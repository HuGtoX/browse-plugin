/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F8F8F8",
      },
      backgroundColor: {
        primary: "#03DDB9",
      },
    },
  },
  plugins: [
    {
      "@tailwindcss/line-clamp": {}, // 👈 启用 line-clamp 插件
      autoprefixer: {},
      "postcss-preset-env": {},
    },
  ],
};
