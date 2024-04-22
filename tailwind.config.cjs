/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'screen': "url('assets/bg_image.jpg')",
      }
    },
  },
  plugins: [],
};
