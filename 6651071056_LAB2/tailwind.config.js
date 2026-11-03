/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: { 500: '#059669', 600: '#047857' },
        paper: '#f4f5f0',
        ink: '#11281e',
      },
      fontFamily: {
        editorial: ['STIX Two Text', 'Georgia', 'serif'],
        sans: ['Be Vietnam Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
