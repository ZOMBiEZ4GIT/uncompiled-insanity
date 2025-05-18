/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-background',
    'bg-card',
    'text-text',
    'text-primary',
    'text-accent',
    'text-accent2',
    'text-accent3',
    'border-border',
    'bg-accent',
    'bg-accent2',
    'bg-accent3',
    'bg-primary',
    'text-error',
    'text-success',
    'bg-error',
    'bg-success',
  ],
  theme: {
    extend: {
      colors: {
        background: '#181A1B', // deep charcoal
        card: '#23201A', // dark olive brown
        primary: '#A68A64', // ochre/gold
        accent: '#4B6B47', // earthy green
        accent2: '#B86B4B', // clay red
        accent3: '#3B5D5B', // muted teal
        border: '#3A3328', // warm dark brown
        text: '#F3E9DC', // warm beige
        muted: '#B8A898', // muted beige
        error: '#B86B4B', // clay red
        success: '#4B6B47', // earthy green
        neon: '#EC4899',
        brand: '#6366F1',
        nav: '#fff',
        navText: '#18181B',
        dark: {
          primary: '#818CF8',
          accent: '#34D399',
          card: '#1F2937',
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(60, 40, 20, 0.15)',
        'card-hover':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
