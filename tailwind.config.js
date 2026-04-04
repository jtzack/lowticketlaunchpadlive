/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#f8f4e9',
        dark: '#2f2e2b',
        'dark-deep': '#1c2220',
        orange: '#f35a1f',
        yellow: '#ffe27a',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '960px',
      },
    },
  },
  plugins: [],
}
