// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                bakery: {
                    bg: '#FDF8F1',
                    card: '#FFFFFF',
                    text: '#4A3728',
                    accent: '#D97706',
                    soft: '#F9F1E5',
                    border: '#D9C4A9',
                    danger: '#7C2D12',
                }
            },
            fontFamily: {
                display: ['Lalezar'],
                body: ['Vazirmatn'],
            }
        },
    },
    plugins: [],
}
