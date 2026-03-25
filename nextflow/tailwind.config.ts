/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Krea-inspired dark theme
        background: "#0a0a0f",
        surface: "#12121a",
        "surface-2": "#1a1a26",
        "surface-3": "#22222f",
        border: "#2a2a3d",
        "border-2": "#3a3a55",
        primary: "#7c3aed",
        "primary-hover": "#6d28d9",
        "primary-light": "#8b5cf6",
        accent: "#a78bfa",
        "text-primary": "#f4f4f8",
        "text-secondary": "#9999bb",
        "text-muted": "#5555777",
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",
        // Node colors
        "node-bg": "#16161f",
        "node-border": "#2e2e45",
        "node-selected": "#7c3aed",
        // Edge colors
        edge: "#7c3aed",
        "edge-animated": "#a78bfa",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px #7c3aed, 0 0 10px #7c3aed, 0 0 20px #7c3aed",
          },
          "50%": {
            boxShadow:
              "0 0 10px #a78bfa, 0 0 25px #a78bfa, 0 0 50px #a78bfa",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
