/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: "425px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
        },
        extend: {
            colors: {
                blue: {
                    DEFAULT: "#6366f1",
                },
                white: {
                    DEFAULT: "#ffffff",
                },
            },
            screens: {
                ssm: "320px",
                xxl: "1440px",
            },
        },
    },
    plugins: [],
};
