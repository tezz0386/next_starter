/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // Example extension; adjust as needed
      colors: {
        brand: '#1d4ed8'
      }
    }
  },
  plugins: [],
};
