/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080A10',
          card: '#0D1117',
          surface: '#161B22',
          border: '#21262D',
          gold: '#EAB308',
          amber: '#F59E0B',
          emerald: '#10B981',
          green: '#059669',
          red: '#EF4444',
          blue: '#38BDF8',
          purple: '#8B5CF6',
          text: '#9AA4B2',
          heading: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(234, 179, 8, 0.2), 0 0 20px rgba(234, 179, 8, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(234, 179, 8, 0.5), 0 0 30px rgba(234, 179, 8, 0.3)' },
        }
      }
    },
  },
  plugins: [],
}
