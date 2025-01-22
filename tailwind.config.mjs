/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        racing: ['Racing Sans One', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand Colors
        primary: {
          DEFAULT: "#FF6B6B",  // Coral Red
          50: "#FFE5E5",
          100: "#FFD1D1",
          900: "#7F3636"
        },
        secondary: {
          DEFAULT: "#4ECDC4",  // Turquoise
          50: "#E6F7F5",
          100: "#CCF0EA",
          900: "#266E64"
        },
        accent: {
          DEFAULT: "#45B7D1",  // Ocean Blue
          50: "#E6F4F9",
          100: "#CCE9F3",
          900: "#235C75"
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827"
        }
      }
    },
  },
  plugins: [],
};
