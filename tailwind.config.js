/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary : "#1b1b1f",
        secnd : "#202127",
        accent : "#f49843"
      },

      backgroundImage:{
        'master':"url('./bg.png')"
      }
    },
  },
  plugins: [],
}
