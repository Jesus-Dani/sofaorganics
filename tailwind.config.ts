import type { Config } from "tailwindcss";

// Design tokens per UI Design Doc §2-4. Do not add ad hoc colors/fonts here —
// every value traces back to the "Sage Garden" palette and the locked type/shape rules.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4E5026", // Olive Grove
          tint: "#E4E6DA",
        },
        secondary: {
          DEFAULT: "#C8BA7E", // Sage Garden
          tint: "#EFE6CB",
        },
        accent: {
          DEFAULT: "#CB6843", // Rusted Terra
          tint: "#F5DED4", // decorative use (category tiles) — same derivation as error-surface
        },
        background: {
          DEFAULT: "#F6F2EB", // Soft Lily
          alt: "#EFE9DE",
        },
        text: {
          DEFAULT: "#49392C", // Espresso Soil
          muted: "#8A7B6E",
        },
        border: "#E4DFD3",
        "error-surface": "#F5DED4", // Rusted Terra, ~85% lightened
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-karla)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Sharp/near-zero everywhere by default (UI Doc §4).
        none: "0px",
        DEFAULT: "1px",
        // Scoped exception: category/feature tiles only (UI Doc §5.2).
        tile: "14px",
        full: "9999px",
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        // Named 8px-grid steps (UI Doc §4) layered on top of Tailwind's default
        // 4px-based scale — use these where a section explicitly calls for the grid.
        "8px": "8px",
        "16px": "16px",
        "24px": "24px",
        "32px": "32px",
        "40px": "40px",
        "48px": "48px",
        "64px": "64px",
        "72px": "72px",
        "96px": "96px",
      },
      screens: {
        sm: "600px",
        md: "1024px",
        lg: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
