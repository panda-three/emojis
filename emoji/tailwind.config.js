/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f0ff',
          100: '#ebe1ff',
          200: '#d6c4ff',
          300: '#b99bff',
          400: '#9a6bff',
          500: '#7a3cff',
          600: '#6625f0',
          700: '#531bd1',
          800: '#4217a5',
          900: '#34147f'
        }
      },
      boxShadow: {
        glow: '0 20px 50px rgba(122, 60, 255, 0.3)'
      }
    }
  },
  plugins: []
};
