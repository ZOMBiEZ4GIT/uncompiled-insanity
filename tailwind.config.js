/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        brand: '#7C3AED',
        accent: '#06D6A0',
        card: '#fff',
        cardBorder: '#e5e7eb',
        nav: '#fff',
        navText: '#18181B',
        // Dark mode
        dark: {
          brand: '#A78BFA',
          accent: '#06D6A0',
          card: '#18181B',
          cardBorder: '#27272A',
          nav: '#111827',
          navText: '#fff',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
