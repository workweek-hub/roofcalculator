module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        select: "1fr max-content",
        thickness: "repeat(3, max-content)",
        colors: "repeat(6, max-content)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
