/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        veris: {
          green: '#10B981',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          orange: '#F59E0B',
          red: '#EF4444',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
