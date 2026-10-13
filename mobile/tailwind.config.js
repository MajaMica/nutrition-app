/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
  primary: 'rgb(var(--color-primary) / <alpha-value>)',
  background: 'rgb(var(--color-background) / <alpha-value>)',
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  text: 'rgb(var(--color-text) / <alpha-value>)',
  textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
  border: 'rgb(var(--color-border) / <alpha-value>)',
},
    },
  },
  plugins: [],
};