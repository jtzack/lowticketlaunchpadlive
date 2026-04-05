/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#F7F5ED',
        dark: '#272727',
        'dark-deep': '#000000',
        blue: '#87B8F8',
        'blue-dark': '#5F85B6',
        yellow: '#F9E35D',
      },
      fontFamily: {
        display: ['Fjalla One', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '960px',
        wide: '1120px',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
      },
    },
  },
  plugins: [],
}
