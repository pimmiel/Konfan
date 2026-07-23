/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class", // "bedtime mode" toggles .dark on <html>
  theme: {
    extend: {
      colors: {
        // --- Kònfăn palette: cottagecore at dusk / candlelight ---
        // Semantic tokens map to CSS variables set in index.css so
        // "bedtime mode" can re-theme everything by swapping variables.
        paper: "rgb(var(--paper) / <alpha-value>)", // warm parchment ground
        ink: "rgb(var(--ink) / <alpha-value>)", // primary text
        muted: "rgb(var(--muted) / <alpha-value>)", // secondary text
        line: "rgb(var(--line) / <alpha-value>)", // hairline borders
        surface: "rgb(var(--surface) / <alpha-value>)", // raised cards
        // Named brand hues (fixed, not mode-dependent)
        honey: {
          DEFAULT: "#E0A458", // candlelight — the warm accent (NOT terracotta)
          soft: "#EFCB99",
          deep: "#C4842F",
        },
        sage: {
          DEFAULT: "#8B9D83", // herb-garden green
          soft: "#B4C0AC",
          deep: "#5F6E58",
        },
        plum: {
          DEFAULT: "#3B2E3A", // twilight
          deep: "#2A2231", // near-night (bedtime ground)
          soft: "#6E5C6B",
        },
        rose: {
          DEFAULT: "#C99BA0", // dried-rose / faded chintz
          soft: "#E4C4C7",
        },
      },
      fontFamily: {
        // Display + poems: Fraunces (soft, literary old-style — not Playfair)
        display: ['Fraunces', 'Georgia', 'serif'],
        // Body + UI: Instrument Sans, with Thai handled by Noto Sans Thai
        sans: ['Instrument Sans', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        thai: ['Noto Sans Thai', 'sans-serif'],
      },
      borderRadius: {
        // soft, hand-thrown-pottery corners
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        // diffuse candle-glow, never hard drop shadows
        glow: "0 0 40px -8px rgb(var(--glow) / 0.45)",
        lift: "0 8px 30px -12px rgb(var(--ink) / 0.25)",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
