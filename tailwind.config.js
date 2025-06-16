/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        fenix: {
          red: '#b91c1c',     // rojo principal (bg-red-700 base)
          dark: '#1a1a1a',     // fondo oscuro (negro profundo)
          light: '#f9fafb',    // fondo claro
          yellow: '#facc15',   // amarillo opcional (warning o acento)
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Oswald', 'sans-serif'],  // para headers grandes si querés más impacto
      },
      screens: {
        'xs': '375px',  // iPhone SE
        '3xl': '1600px' // pantallas grandes, opcional
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        strong: '0 4px 16px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}