/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Bebas Neue"', 'cursive'],
      },
      colors: {
        'brand-background': '#0D1117',
        'brand-surface': '#161B22',
        'brand-border': '#30363D',
        'brand-primary': '#8B5CF6',
        'brand-secondary': '#EC4899',
        'brand-text-primary': '#E6EDF3',
        'brand-text-secondary': '#7D8590',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
