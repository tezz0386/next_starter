/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      // Example: add a subtle brand color
      colors: {
        brand: {
          50: '#f5faff',
          100: '#e6f0ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  },
  plugins: []
};
