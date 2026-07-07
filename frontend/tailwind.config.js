/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a3b8fc',
          400: '#7a91f8',
          500: '#5568ef',
          600: '#3d47e0',
          700: '#3237c2',
          800: '#2b309d',
          900: '#282e7c',
          950: '#1a1b4b',
        },
        accent: {
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fde08a',
          300: '#fbc94d',
          400: '#fab324',
          500: '#f4930c',
          600: '#d86d07',
          700: '#b34d0a',
          800: '#913c0f',
          900: '#78330f',
        },
        surface: {
          50: '#f8f9fc',
          100: '#f1f2f8',
          200: '#e4e6f0',
          800: '#1e2033',
          900: '#14152b',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(26, 27, 75, 0.06), 0 1px 2px rgba(26, 27, 75, 0.04)',
        'card': '0 4px 24px rgba(26, 27, 75, 0.08)',
      },
    },
  },
  plugins: [],
}