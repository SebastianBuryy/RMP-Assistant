const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'sm': '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        'md': '0 0px 10px 4px rgba(153, 88, 238, 0.5)',
        'lg': '0 0px 10px 4px rgba(255, 255, 255, 0.8)',
        'xl': '0px 0px 10px 4px rgba(153, 88, 238, 1)',
        '2xl': '0 0px 10px 2px rgba(0, 0, 0, 0.3)',
        '3xl': '0 0px 10px 6px rgba(153, 108, 238, 1)',
      },
      dropShadow: {
        'sm': '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        'md': '0 0px 10px 4px rgba(153, 88, 238, 0.5)',
        'lg': 'filter: drop-shadow(0 1px 2px rgb(255 255 255 / 0.1)) drop-shadow(0 1px 1px rgb(255 255 255 / 0.06))',
        'xl': '0px 20px 10px 4px rgba(153, 88, 238, 1)',
        '2xl': '0 0px 10px 4px rgba(153, 88, 238, 1)',
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      colors: {
        'amethyst': {
          '50': '#f9f6fe',
          '100': '#f1e9fe',
          '200': '#e6d7fd',
          '300': '#d3b8fa',
          '400': '#b78af6',
          '500': '#9958ee',
          '600': '#863de0',
          '700': '#712bc5',
          '800': '#6028a1',
          '900': '#4f2281',
          '950': '#330c5f',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
