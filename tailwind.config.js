// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./index.html","./src/components/Footer.jsx", "./src/**/*.{js,jsx,ts,tsx}"],
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
          DEFAULT: "#1E3A8A", // أزرق غامق
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // أزرق متوسط
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a", // الأساسي
        },
        accent: {
          DEFAULT: "#3B82F6", // أزرق فاتح شوي
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        neutral: colors.slate, // رمادي حديث ومتوازن
        white: "#ffffff",
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
