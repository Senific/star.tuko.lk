import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'royal-gold': {
          50: '#fdf9e9',
          100: '#fbf0c4',
          200: '#f8e48b',
          300: '#f4d148',
          400: '#efc01d',
          500: '#D4AF37', // Primary Gold
          600: '#b8860b',
          700: '#93650d',
          800: '#7a5012',
          900: '#674215',
        },
        'deep-purple': {
          50: '#f5f3f7',
          100: '#ebe5ef',
          200: '#d9cfe1',
          300: '#bfacc9',
          400: '#9f81ab',
          500: '#845f91',
          600: '#6e4a78',
          700: '#5c3d63',
          800: '#4A154B', // Primary Purple
          900: '#3d1240',
        },
        'hot-pink': {
          50: '#fff0f5',
          100: '#ffe0eb',
          200: '#ffc6db',
          300: '#ff9bbd',
          400: '#ff6096',
          500: '#FF1493', // Accent Pink
          600: '#ed0076',
          700: '#c8005f',
          800: '#a6054f',
          900: '#8a0a45',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #4A154B 0%, #1a0a1a 50%, #D4AF37 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #f4d148 50%, #D4AF37 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
