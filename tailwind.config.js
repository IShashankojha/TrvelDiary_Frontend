/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      display:["Poppins","sans-serif"],
    },
    extend: {
      //Colors used in the project
      colors:{
        primary:"#05B603",
        secondary:"#EF863E",
        
      },
      backgroundImage:{
        'login-bg-img':"url('/images/F1.jpeg')",
        'signup-bg-img':"url('/images/f3.jpeg')",
      }
    },
  },
  plugins: [],
}

