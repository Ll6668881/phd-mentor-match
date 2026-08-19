/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 马卡龙治愈系配色
      colors: {
        macaron: {
          pink: '#FFD9E8',
          blue: '#D6E8FF',
          mint: '#D3F2E4',
          lavender: '#E6DFF7',
          cream: '#FFF6E8',
          lemon: '#FFF4C9',
          rose: '#FFC9DE',
        },
      },
      boxShadow: {
        soft: '0 4px 20px rgba(160, 150, 200, 0.14)',
        softer: '0 2px 12px rgba(160, 150, 200, 0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
