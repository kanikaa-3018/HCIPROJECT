/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        dark: {
          50: '#f8f9fa',
          100: '#f0f4f8',
          200: '#d4dce8',
          300: '#b8c5d6',
          400: '#6b7684',
          500: '#4a5568',
          600: '#374151',
          700: '#1f2937',
          800: '#111827',
          900: '#030712',
        },
        // Light backgrounds for light mode - warm cream/off-white
        light: {
          50: '#faf8f3',
          100: '#f5f3ed',
          200: '#efe9e0',
          300: '#e8e1d5',
          400: '#dcd3c5',
        },
        // Soft sage green - minimal, natural aesthetic
        primary: {
          50: '#f4f7f6',
          100: '#e0ebe7',
          200: '#b8d5cc',
          300: '#8fbfb0',
          400: '#6aa899',
          500: '#5a8e7f',
          600: '#4a7a6e',
          700: '#3d6559',
          800: '#305145',
          900: '#1f3531',
        },
        // Soft slate blue - sophisticated
        secondary: {
          50: '#f5f7fa',
          100: '#e6ebf2',
          200: '#c5d3e0',
          300: '#a3b8cd',
          400: '#819ebb',
          500: '#6b7c9c',
          600: '#5a6b85',
          700: '#475670',
          800: '#36415b',
          900: '#252d46',
        },
        // Warm terracotta - cozy accent
        accent: {
          50: '#faf6f3',
          100: '#f3e8e1',
          200: '#e4cfc5',
          300: '#d4b5a8',
          400: '#c89987',
          500: '#c17a65',
          600: '#b36355',
          700: '#a0563e',
          800: '#7d3d2e',
          900: '#5a2b1f',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d1cfcd',
          400: '#9d9995',
          500: '#6b6764',
          600: '#5a5652',
          700: '#4b4743',
          800: '#3c3935',
          900: '#2d2a27',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        bounce: 'bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        glow: 'glow 2.5s ease-in-out infinite',
        pulse: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 3s infinite',
        float: 'float 3s ease-in-out infinite',
        scaleIn: 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(25px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-25px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 25px rgba(90, 142, 127, 0.3)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 40px rgba(90, 142, 127, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(90, 142, 127, 0.2)',
        'glow-md': '0 0 30px rgba(90, 142, 127, 0.3)',
        'glow-lg': '0 0 45px rgba(90, 142, 127, 0.4)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'inset-light': 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
        'dark': '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
