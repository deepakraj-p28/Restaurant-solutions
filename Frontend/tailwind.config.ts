import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./scripts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bocca: {
          ink: "#303136",
          blue: "#236f87",
          paper: "#f2f2f0",
          warm: "#f4f1ea",
          copper: "#b87333",
        },
      },
      fontFamily: {
        display: ["Impact", "\"Arial Narrow\"", "\"Franklin Gothic Heavy\"", "sans-serif"],
        sans: ["Inter", "\"Segoe UI\"", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        "login-card": "0 24px 80px rgba(58, 42, 29, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
