import { heroui } from "@heroui/theme"
import { col } from "framer-motion/client";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/app/*.{js,ts,jsx,tsx,mdx}',
    './src/components/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    layout: {
      
    }
  })],
}

module.exports = config;