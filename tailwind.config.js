// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "16px",
      screens: { xl: "1200px", "2xl": "1320px" },
    },
    extend: {
      boxShadow: {
        soft: "0 10px 25px rgba(16, 24, 40, 0.06)",  
      },
      colors: {
        primary: {
          DEFAULT: "#7c533a",
          50: "#f7f3f1",
          100: "#efe7e2",
          200: "#dfcfc5",
          300: "#cfb7a8",
          400: "#b78d74",
          500: "#7c533a",
          600: "#6f4b34",
          700: "#5f3f2b",
          800: "#503423",
          900: "#3e2719",
        },
        accent: colors.yellow,
        neutral: colors.neutral,
      },
      fontFamily: {
        sans: ["Cairo", "ui-sans-serif", "system-ui", "Segoe UI", "Arial"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgb(0 0 0 / 0.15)",
      },
      backgroundImage: {
        "radial-accent":
          "radial-gradient(ellipse at center, rgba(234,179,8,0.12), transparent 60%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
