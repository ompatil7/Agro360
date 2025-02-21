/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mycol: {
          default: "#A6AEBF",
          light: "#f8f8f8",
          dark: "#f8f8f8",
          nyanza: "#d8f3dc",
          celadon: {
            DEFAULT: "#b7e4c7",
            2: "#95d5b2",
          },
          navGreen: "#A0C878",
          mint: {
            DEFAULT: "#74c69d",
            2: "#52b788",
          },
          sea_green: "#40916c",
          dartmouth_green: "#2d6a4f",
          brunswick_green: "#1b4332",
          dark_green: "#081c15",
        },
      },
      fontFamily: { sans: ['Almarai', ...defaultTheme.fontFamily.sans], },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
    },
  },
  keyframes: {
    aurora: {
      from: {
        backgroundPosition: "50% 50%, 50% 50%",
      },
      to: {
        backgroundPosition: "350% 50%, 350% 50%",
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
