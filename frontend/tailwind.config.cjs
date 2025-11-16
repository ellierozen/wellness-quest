/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          medieval: ["MedievalSharp", "serif"],
          cinzel: ["Cinzel Decorative", "serif"],
        },
      },
    },
    plugins: [],
  };