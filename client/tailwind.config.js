/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          DEFAULT: "#32CCFF",
          100: "#D8F5FF",
          200: "#A8E9FF",
          300: "#7DDFFF",
          400: "#09ADE3",
          500: "#08648B",
          600: "#061A21",
          700: "#0F1A1E",
        },
      },
    },
  },
  plugins: [],
};
