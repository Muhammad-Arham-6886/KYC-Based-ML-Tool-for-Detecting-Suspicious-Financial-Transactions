/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1e3a8a',
        'secondary-teal': '#0d9488',
        'alert-red': '#dc2626',
        'warning-yellow': '#f59e0b',
        'safe-green': '#10b981',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
