/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0A0E14",
                velvet: {
                    burgundy: "#4A0E0E",
                    gold: "#D4AF37",
                    "gold-soft": "#D4AF37",
                    cream: "#F0EAD6",
                    dark: "#050709",
                    black: "#0A0E14",
                    beige: "#F5F5ED", // For AI Insight and Communication card
                },
            },
            fontFamily: {
                heading: ["var(--font-montserrat)", "serif"], // Montserrat used as serif-like or with serif alternatives
                body: ["var(--font-inter)", "sans-serif"],
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(74, 14, 14, 0.3)',
                'gold': '0 0 15px -3px rgba(212, 175, 55, 0.2)',
                'card': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
            }
        },
    },
    plugins: [],
};

