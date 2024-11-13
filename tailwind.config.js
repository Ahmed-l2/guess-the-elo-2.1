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
      maxWidth: {
        '1xl': '39rem', // Customize this value
      },
      backgroundImage:{
        'master':"url('/bg.png')",
        'wood':"url('/bgs/bg2.jpg')"
      },
      fontFamily: {
        'baloo': ["Baloo 2", 'sans-serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'russo': ['Russo One', 'sans-serif'],
        'luckiest': ['Luckiest Guy', 'sans-serif']
      }
    },  },
  plugins: [],
}