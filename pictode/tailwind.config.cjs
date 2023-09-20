/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        navyBlue: {
          100: '#49555f',
          200: '#363d44',
          300: '#2c3136',
          400: '#212529',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
