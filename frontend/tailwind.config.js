module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
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
      extend: {
        animation: {
          'fade-in': 'fadeInUp 0.5s ease-out',
          'pulse-glow': 'pulse-glow 1.5s infinite',
          'shimmer': 'shimmer 1.5s infinite',
        },
        keyframes: {
          fadeInUp: {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          },
          'pulse-glow': {
            '0%, 100%': { 'box-shadow': '0 0 5px rgba(59, 130, 246, 0.3)' },
            '50%': { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.6)' }
          },
          shimmer: {
            '0%': { 'background-position': '-200% 0' },
            '100%': { 'background-position': '200% 0' }
          }
        }
      }
    }
  }
}