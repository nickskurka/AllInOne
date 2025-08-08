/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Clash Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        'light-primary': '#fff',
        'light-secondary': '#f8fafc',
        'light-border': '#cbd5e1',
        'light-text': '#334155',
        'dark-primary': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-border': '#475569',
        'dark-text': '#e2e8f0',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
