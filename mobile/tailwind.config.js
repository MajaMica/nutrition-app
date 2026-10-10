/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',        // ← DODAJ OVU LINIJU
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#B3FF47',
        background: '#0D0D0D',
        surface: '#1A1A1A',
        text: '#FFFFFF',
        textSecondary: '#A0A0A0',
        border: '#2A2A2A',
      },
    },
  },
  plugins: [],
};