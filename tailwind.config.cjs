/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue, js, ts, jsx, tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            primary : ['BioRhyme', 'sans-serif'],
            secondary : ['Cabin', 'sans-serif'],
        },
        colors: {
            primary: '#25283D',
            secondary: '#22AAA1',
            tertiary: '#C59FC9',
            quaternary: '#DB93B0',
            quinary: '#84CAE7'
        }
    },
  },
  plugins: [],
}
