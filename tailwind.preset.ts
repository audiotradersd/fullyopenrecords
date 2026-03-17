import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        ink: "#0F0621",
        midnight: "#1E0D3A",
        haze: "#1E0D3A",
        plum: "#3A1B5C",
        paper: "#241146",
        line: "#4D2B73",
        ember: "#A12C6A",
        pink: "#D14A8B",
        rose: "#E36A9C",
        sand: "#FFFFFF",
        fog: "#C9B6D9",
        glow: "#D14A8B"
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        meta: ["var(--font-display)", "Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(8, 4, 20, 0.42)"
      }
    }
  },
  plugins: []
} satisfies Partial<Config>;

export default config;
