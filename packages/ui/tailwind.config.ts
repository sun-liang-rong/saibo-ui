import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyberpunk Primary Colors (Cyan) - Updated
        primary: {
          DEFAULT: '#06f9f9',
          50: '#e6fdff',
          100: '#ccfbff',
          200: '#99f7ff',
          300: '#66f3ff',
          400: '#33f0ff',
          500: '#06f9f9',
          600: '#05c7c7',
          700: '#049595',
          800: '#036363',
          900: '#023131',
          950: '#011818',
        },
        // Cyberpunk Secondary Colors (Magenta) - Updated
        secondary: {
          DEFAULT: '#ff00ff',
          50: '#ffe6ff',
          100: '#ffccff',
          200: '#ff99ff',
          300: '#ff66ff',
          400: '#ff33ff',
          500: '#ff00ff',
          600: '#cc00cc',
          700: '#990099',
          800: '#660066',
          900: '#330033',
          950: '#1a001a',
        },
        'accent-magenta': '#ff00ff',
        // Background Colors
        'background-light': '#f5f8f8',
        'background-dark': '#0b0e14',
        // Surface Colors
        'surface-dark': '#1F2533',
        'surface-border': '#2d3b4e',
        // Semantic Colors - Updated
        'success-neon': '#39ff14',
        'warning-orange': '#ffaa00',
        'error-red': '#ff003c',
        success: '#00ff00',
        warning: '#ff8c00',
        error: '#ff0000',
        // Alert Colors
        'alert-bg': 'rgba(255, 0, 255, 0.1)',
        'success-bg': 'rgba(0, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Noto Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        // Grid Pattern for Cyberpunk effect
        'grid-pattern':
          'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
        // Scanline effect
        'scanline':
          'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        // Radial Grid
        'grid-radial': 'radial-gradient(circle, rgba(0,255,255,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-pattern': '40px 40px',
        'scanline': '100% 2px, 3px 100%',
        'grid-radial': '20px 20px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      clipPath: {
        'clipped-corner-sm': 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
        'clip-tag': 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        'clip-chip': 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
      },
      boxShadow: {
        'neon-glow-intense': '0 0 10px rgba(6, 249, 249, 0.8), 0 0 20px rgba(6, 249, 249, 0.6), 0 0 30px rgba(6, 249, 249, 0.4)',
        'neon-magenta': '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6)',
        'neon-success': '0 0 10px rgba(57, 255, 20, 0.8), 0 0 20px rgba(57, 255, 20, 0.6)',
        'neon-warning': '0 0 10px rgba(255, 170, 0, 0.8), 0 0 20px rgba(255, 170, 0, 0.6)',
        'neon-error': '0 0 10px rgba(255, 0, 60, 0.8), 0 0 20px rgba(255, 0, 60, 0.6)',
        'glitch-border': '-2px 0 0 #ff003c, 2px 0 0 #06f9f9',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Cyberpunk Animations
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,255,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,255,0.8)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
