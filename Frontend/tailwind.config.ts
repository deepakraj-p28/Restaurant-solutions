import type { Config } from "tailwindcss";

const cssVarColor = (name: string) => `oklch(from var(${name}) l c h / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./scripts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: cssVarColor("--background"),
        foreground: cssVarColor("--foreground"),
        card: {
          DEFAULT: cssVarColor("--card"),
          foreground: cssVarColor("--card-foreground"),
        },
        popover: {
          DEFAULT: cssVarColor("--popover"),
          foreground: cssVarColor("--popover-foreground"),
        },
        primary: {
          DEFAULT: cssVarColor("--primary"),
          foreground: cssVarColor("--primary-foreground"),
        },
        secondary: {
          DEFAULT: cssVarColor("--secondary"),
          foreground: cssVarColor("--secondary-foreground"),
        },
        muted: {
          DEFAULT: cssVarColor("--muted"),
          foreground: cssVarColor("--muted-foreground"),
        },
        accent: {
          DEFAULT: cssVarColor("--accent"),
          foreground: cssVarColor("--accent-foreground"),
        },
        destructive: cssVarColor("--destructive"),
        border: cssVarColor("--border"),
        input: cssVarColor("--input"),
        ring: cssVarColor("--ring"),
        chart: {
          "1": cssVarColor("--chart-1"),
          "2": cssVarColor("--chart-2"),
          "3": cssVarColor("--chart-3"),
          "4": cssVarColor("--chart-4"),
          "5": cssVarColor("--chart-5"),
        },
        sidebar: {
          DEFAULT: cssVarColor("--sidebar"),
          foreground: cssVarColor("--sidebar-foreground"),
          primary: cssVarColor("--sidebar-primary"),
          "primary-foreground": cssVarColor("--sidebar-primary-foreground"),
          accent: cssVarColor("--sidebar-accent"),
          "accent-foreground": cssVarColor("--sidebar-accent-foreground"),
          border: cssVarColor("--sidebar-border"),
          ring: cssVarColor("--sidebar-ring"),
        },
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
      ringWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
