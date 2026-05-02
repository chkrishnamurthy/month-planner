/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      colors: {
        bg: {
          light: '#F6F5F0',
          dark: '#0A0A0A',
        },
        card: {
          light: '#FFFFFF',
          dark: '#141414',
        },
        hero: '#0A0A0A',
        accent: {
          DEFAULT: '#C7F051',
          ink: '#0A0A0A',
        },
        cat: {
          rent: '#8AB4F8',
          food: '#FF9A6B',
          travel: '#F4D03F',
          bills: '#A8E063',
          misc: '#C9A8FF',
        },
        muted: {
          light: '#6B6B66',
          dark: '#8A8A85',
        },
        line: {
          light: '#E8E6DD',
          dark: '#1F1F1F',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
