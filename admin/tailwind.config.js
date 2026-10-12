/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B3FF47',
        background: '#0D0D0D',
        surface: '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        border: '#2A2A2A',
      },
    },
  },
  plugins: [],
}