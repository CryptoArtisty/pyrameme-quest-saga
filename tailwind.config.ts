
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        gold: "#FFD700",
        sand: "#c2b280",
        brown: "#4a3728",
        dark: "#1a1a1a",
        "grid-line": "rgba(255,215,0,0.3)",
        "maze-wall": "#00ffff",
        "hint-color": "rgba(0,255,255,0.3)",
        border: "rgba(255,215,0,0.5)",
      },
      fontFamily: {
        medieval: ["MedievalSharp", "cursive"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(45deg, #1a1a1a, #2c1f0f)",
        "gradient-game": "linear-gradient(to bottom, #ff8c00, #ff4500)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
