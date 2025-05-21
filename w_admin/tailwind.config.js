/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lao: ['"Noto Sans Lao Looped"', 'Phetsarath', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
