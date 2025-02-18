import formsPlugin from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [formsPlugin],
} satisfies Config;
