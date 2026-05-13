/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366f1', 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
        surface: { DEFAULT: '#1a1a2e', card: '#16213e', border: '#0f3460' },
        xp: '#6366f1', gold: '#f59e0b', vigor: '#10b981', streak: '#f97316',
      },
    },
  },
  plugins: [],
}
