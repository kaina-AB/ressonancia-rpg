import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#e8dcc0",
        ink: "#1a1512",
        blood: "#7a1f1f",
        gold: "#b8933a",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["EB Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
