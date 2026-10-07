/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F5F5F5",
        mist: "#C8C8C8",
        dull: "#8F8F8F",
        coal: "#050505",
        ash: "#0A0A0A",
        smoke: "#0F0F0F",
        slate: "#141414",
        raised: "#1A1A1A",
        line: "#262626",
        gold: {
          DEFAULT: "#D4AF37",
          bright: "#F1D36A",
          soft: "#E6C766",
          dark: "#9C7A18",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
