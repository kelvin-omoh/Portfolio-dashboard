/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'satoshi': ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        'ivy': ['Ivy Mode', 'serif'],
      },
    },
  },
  plugins: [],
}

