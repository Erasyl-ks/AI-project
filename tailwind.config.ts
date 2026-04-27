import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        zan: {
          50: "#eef3fb",
          100: "#d5e1f3",
          200: "#a8bfe2",
          300: "#7499cf",
          400: "#4974b9",
          500: "#2756a3",
          600: "#0B3C8C",
          700: "#092f6f",
          800: "#072354",
          900: "#04163a",
          ink: "#081b3a",
          gold: "#d6b15c",
          cream: "#f5f1e6"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(11,60,140,0.25)",
        ring: "0 0 0 6px rgba(11,60,140,0.08)"
      },
      backgroundImage: {
        "zan-grid":
          "radial-gradient(circle at 1px 1px, rgba(11,60,140,0.08) 1px, transparent 0)",
        "zan-hero":
          "radial-gradient(1200px 600px at 80% -20%, rgba(11,60,140,0.18), transparent 60%), radial-gradient(900px 500px at -10% 20%, rgba(11,60,140,0.12), transparent 60%)"
      },
      animation: {
        "fade-up": "fadeUp 700ms cubic-bezier(.22,.8,.22,1) both",
        "pulse-ring": "pulseRing 1.8s ease-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(11,60,140,0.6)" },
          "100%": { boxShadow: "0 0 0 24px rgba(11,60,140,0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
