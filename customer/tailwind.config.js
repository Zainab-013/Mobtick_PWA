// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-in': 'bounceIn 1s ease-out',
        fadeIn: "fadeIn 1s ease-in-out forwards",
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px white' },
          '100%': { textShadow: '0 0 20px white, 0 0 40px grey' },
        },
        shimmer: {
          '0%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4)' },
          '100%': { filter: 'brightness(1)' },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '0',
          },
          '60%': {
            transform: 'scale(1.1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
