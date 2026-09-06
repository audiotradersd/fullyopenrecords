import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        ink: "#030816",
        midnight: "#07152D",
        haze: "#061126",
        plum: "#102B54",
        paper: "#0B1D3B",
        line: "#24558C",
        ember: "#1A65B8",
        pink: "#3B9DFF",
        rose: "#75C8FF",
        sand: "#FFFFFF",
        fog: "#B7CAE5",
        glow: "#3B9DFF"
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        meta: ["var(--font-display)", "Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 10, 28, 0.56)"
      }
    }
  },
  plugins: []
} satisfies Partial<Config>;

export default config;
