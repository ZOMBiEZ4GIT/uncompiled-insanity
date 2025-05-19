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
    'text-text-muted',
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
    'hover:bg-card',
    'hover:text-primary',
    'focus:ring-primary',
    'focus:border-primary',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // deep navy
        card: '#1e293b', // slate
        primary: '#818cf8', // indigo
        accent: '#34d399', // emerald
        accent2: '#f472b6', // pink
        accent3: '#fbbf24', // amber
        border: '#334155', // slate border
        text: '#f8fafc', // slate light
        'text-muted': '#94a3b8', // slate
        error: '#ef4444', // red
        success: '#22c55e', // green
        neon: '#ec4899', // pink
        brand: '#818cf8', // indigo
        nav: '#1e293b', // slate
        navText: '#f8fafc', // slate light
        dark: {
          primary: '#818cf8', // indigo
          accent: '#34d399', // emerald
          card: '#1e293b', // slate
          border: '#334155', // slate border
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 4px 24px 0 rgba(0, 0, 0, 0.2)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
