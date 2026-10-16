/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#F4F8F3',
          100: '#E8F2E6',
          200: '#D1E5CE',
          300: '#A9CFA5',
          400: '#75B070',
          500: '#4D9447',
          600: '#3C7737',
          700: '#2D6A4F',  // Natural Agricultural Green (Primary)
          800: '#1B4332',  // Deep Forest Green (Secondary)
          900: '#081C15',  // Darkest Evergreen
          950: '#030E0B',
        },
        cream: {
          50: '#FDFAF4',
          100: '#FBF5E8',
          200: '#F5E9CE',
        },
        warning: {
          50: '#FFF8ED',
          100: '#FEEDD1',
          500: '#E28743',
          600: '#C76A28',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#D9534F',
          600: '#C13935',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 50, 0.06), 0 2px 6px -1px rgba(27, 67, 50, 0.04)',
        'card': '0 10px 30px -4px rgba(27, 67, 50, 0.08), 0 4px 12px -2px rgba(27, 67, 50, 0.03)',
        'elevated': '0 20px 40px -8px rgba(8, 28, 21, 0.12)',
      },
      animation: {
        'scan': 'scan 2.8s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '5%', opacity: '0.8' },
          '50%': { opacity: '1' },
          '100%': { top: '92%', opacity: '0.8' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.94', transform: 'scale(1.015)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
