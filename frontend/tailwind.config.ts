import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#242424",
        middleground: "#363636",
        foreground: "#484848",
      },
      boxShadow: {
        big_inner: "inset 0 0 10px 10px #363636",
        big_outer: "20px 20px 40px 0 #00000040",
      },
    },
  },
  plugins: [],
} satisfies Config;
