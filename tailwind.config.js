/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#000000',
          50: '#FFFFFF',
          100: '#FFFFFF',
          400: '#000000',
          700: '#000000',
          900: '#000000',
        },
        leaf: {
          DEFAULT: '#00B569',
          50: '#00B569',
          100: '#00B569',
          400: '#00B569',
          600: '#00B569',
          700: '#005844',
        },
        border: '#D9D9D9',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Cal Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Cal Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 3px #D9D9D9',
        cardHover: '0 8px 20px #D9D9D9',
      },
    },
  },
  plugins: [],
}
