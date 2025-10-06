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
    "themes": {
      "light": {
        "colors": {
          "default": {
            "50": "#e7e7e7",
            "100": "#c4c5c5",
            "200": "#a2a2a3",
            "300": "#808081",
            "400": "#5d5e5f",
            "500": "#3b3c3d",
            "600": "#313232",
            "700": "#262728",
            "800": "#1c1d1d",
            "900": "#121212",
            "foreground": "#fff",
            "DEFAULT": "#3b3c3d"
          },
          "primary": {
            "50": "#e5e5f5",
            "100": "#c0c1e8",
            "200": "#9b9dda",
            "300": "#7678cc",
            "400": "#5154bf",
            "500": "#2c30b1",
            "600": "#242892",
            "700": "#1d1f73",
            "800": "#151754",
            "900": "#0d0e35",
            "foreground": "#fff",
            "DEFAULT": "#2c30b1"
          },
          "secondary": {
            "50": "#ece3f5",
            "100": "#d1bce6",
            "200": "#b694d7",
            "300": "#9b6dc8",
            "400": "#8045ba",
            "500": "#651eab",
            "600": "#53198d",
            "700": "#42146f",
            "800": "#300e51",
            "900": "#1e0933",
            "foreground": "#fff",
            "DEFAULT": "#651eab"
          },
          "success": {
            "50": "#e2f8f0",
            "100": "#b9efdb",
            "200": "#90e5c6",
            "300": "#68dcb0",
            "400": "#3fd29b",
            "500": "#16c986",
            "600": "#12a66f",
            "700": "#0e8357",
            "800": "#0a5f40",
            "900": "#073c28",
            "foreground": "#000",
            "DEFAULT": "#16c986"
          },
          "warning": {
            "50": "#fff7ec",
            "100": "#ffecd2",
            "200": "#ffe2b7",
            "300": "#ffd79d",
            "400": "#ffcc82",
            "500": "#ffc168",
            "600": "#d29f56",
            "700": "#a67d44",
            "800": "#795c31",
            "900": "#4d3a1f",
            "foreground": "#000",
            "DEFAULT": "#ffc168"
          },
          "danger": {
            "50": "#f8dfe9",
            "100": "#edb3cb",
            "200": "#e386ac",
            "300": "#d9598d",
            "400": "#ce2d6f",
            "500": "#c40050",
            "600": "#a20042",
            "700": "#7f0034",
            "800": "#5d0026",
            "900": "#3b0018",
            "foreground": "#fff",
            "DEFAULT": "#c40050"
          },
          "background": "#ffffff",
          "foreground": "#000000",
          "content1": {
            "DEFAULT": "#ffffff",
            "foreground": "#000"
          },
          "content2": {
            "DEFAULT": "#f4f4f5",
            "foreground": "#000"
          },
          "content3": {
            "DEFAULT": "#e4e4e7",
            "foreground": "#000"
          },
          "content4": {
            "DEFAULT": "#d4d4d8",
            "foreground": "#000"
          },
          "focus": "#006FEE",
          "overlay": "#000000"
        }
      },
      "dark": {
        "colors": {
          "default": {
            "50": "#0d0d0e",
            "100": "#19191c",
            "200": "#26262a",
            "300": "#323238",
            "400": "#3f3f46",
            "500": "#65656b",
            "600": "#8c8c90",
            "700": "#b2b2b5",
            "800": "#d9d9da",
            "900": "#ffffff",
            "foreground": "#fff",
            "DEFAULT": "#3f3f46"
          },
          "primary": {
            "50": "#0d0e35",
            "100": "#151754",
            "200": "#1d1f73",
            "300": "#242892",
            "400": "#2c30b1",
            "500": "#5154bf",
            "600": "#7678cc",
            "700": "#9b9dda",
            "800": "#c0c1e8",
            "900": "#e5e5f5",
            "foreground": "#fff",
            "DEFAULT": "#2c30b1"
          },
          "secondary": {
            "50": "#1e0933",
            "100": "#300e51",
            "200": "#42146f",
            "300": "#53198d",
            "400": "#651eab",
            "500": "#8045ba",
            "600": "#9b6dc8",
            "700": "#b694d7",
            "800": "#d1bce6",
            "900": "#ece3f5",
            "foreground": "#fff",
            "DEFAULT": "#651eab"
          },
          "success": {
            "50": "#073c28",
            "100": "#0a5f40",
            "200": "#0e8357",
            "300": "#12a66f",
            "400": "#16c986",
            "500": "#3fd29b",
            "600": "#68dcb0",
            "700": "#90e5c6",
            "800": "#b9efdb",
            "900": "#e2f8f0",
            "foreground": "#000",
            "DEFAULT": "#16c986"
          },
          "warning": {
            "50": "#4d3a1f",
            "100": "#795c31",
            "200": "#a67d44",
            "300": "#d29f56",
            "400": "#ffc168",
            "500": "#ffcc82",
            "600": "#ffd79d",
            "700": "#ffe2b7",
            "800": "#ffecd2",
            "900": "#fff7ec",
            "foreground": "#000",
            "DEFAULT": "#ffc168"
          },
          "danger": {
            "50": "#3b0018",
            "100": "#5d0026",
            "200": "#7f0034",
            "300": "#a20042",
            "400": "#c40050",
            "500": "#ce2d6f",
            "600": "#d9598d",
            "700": "#e386ac",
            "800": "#edb3cb",
            "900": "#f8dfe9",
            "foreground": "#fff",
            "DEFAULT": "#c40050"
          },
          "background": "#000000",
          "foreground": "#ffffff",
          "content1": {
            "DEFAULT": "#18181b",
            "foreground": "#fff"
          },
          "content2": {
            "DEFAULT": "#27272a",
            "foreground": "#fff"
          },
          "content3": {
            "DEFAULT": "#3f3f46",
            "foreground": "#fff"
          },
          "content4": {
            "DEFAULT": "#52525b",
            "foreground": "#fff"
          },
          "focus": "#006FEE",
          "overlay": "#ffffff"
        }
      }
    },
    "layout": {
      "disabledOpacity": "0.6"
    }
  })],
}

module.exports = config;