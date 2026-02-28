import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0d1117",
          card: "#161b22",
          border: "#30363d",
          accent: "#f97316",
          green: "#22c55e",
          red: "#ef4444",
          gold: "#eab308",
        },
      },
      animation: {
        "pulse-green": "pulseGreen 0.6s ease-in-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        confetti: "confetti 0.8s ease-out forwards",
      },
      keyframes: {
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(34, 197, 94, 0.3)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
