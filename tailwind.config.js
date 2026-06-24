/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        royal: {
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
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        glow: '0 0 40px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.35)',
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 40% 80%, rgba(167,139,250,0.2), transparent 50%)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'spin-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'pulse-soft': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'bounce-dot': {
          '0%,80%,100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-dot': 'bounce-dot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
