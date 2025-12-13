/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: 'var(--color-black)',
        'dark-grey': 'var(--color-dark-grey)',
        'light-grey': 'var(--color-light-grey)',
        white: 'var(--color-white)',
      },
      fontFamily: {
        sans: ['Mulish', 'sans-serif'],
      },
      screens: {
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
