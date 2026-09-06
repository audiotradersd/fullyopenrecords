import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        ink: "#030816",
        midnight: "#081326",
        haze: "#050B18",
        plum: "#13253D",
        paper: "#0C1930",
        line: "#294B70",
        ember: "#24527E",
        pink: "#4D7FAF",
        rose: "#8EAFCD",
        sand: "#FFFFFF",
        fog: "#B7C5D5",
        glow: "#4D7FAF"
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
