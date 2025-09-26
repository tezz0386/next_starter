/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,css}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#4f46e5'
        }
      }
    }
  },
  plugins: []
}
