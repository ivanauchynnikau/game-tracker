/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'court-green': '#2E7D32',
        'court-line': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
