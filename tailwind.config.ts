import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryAccent: '#FF6A3D', // Vibrant orange
        secondaryAccent: '#4CAF50', // Soft green
        backgroundDark: '#1A1A1A', // Dark gray for the background
        backgroundLight: '#2C2C2C', // Lighter gray for containers
        textPrimary: '#E0E0E0',     // Off-white text
        textSecondary: '#A6A6A6',   // Muted gray text
        borderDark: '#333333',      // Dark border color for elements
        borderLight: '#444444',     // Slightly lighter for hover effects
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(180deg, #000000, #1A1A2E, #0A0E1A)', // Black with subtle blue and purple
      },
    },
  },
  darkMode: 'class',
  plugins: [],
} satisfies Config;
