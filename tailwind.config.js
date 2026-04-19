/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        got: {
          gold: '#b8860b',
          'gold-light': '#d4a836',
          'gold-dark': '#8b6508',
          dark: '#0d0d1a',
          darker: '#070710',
          card: '#16162a',
          'card-light': '#1e1e3a',
          border: '#2a2a4a',
          parchment: '#f4e4c1',
          'parchment-dark': '#e8d4a8',
          blood: '#8b0000',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['Crimson Text', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
