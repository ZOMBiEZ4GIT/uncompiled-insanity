import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

// Import Poppins font from Google Fonts
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

export default function App({ Component, pageProps }: AppProps) {
  // Ensure dark mode class is set on html for persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <Component {...pageProps} />
  );
}
