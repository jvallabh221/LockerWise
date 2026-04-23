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
                // LockerWise brand tokens
                ink: {
                    50: "#f2f3f6",
                    100: "#dde0e8",
                    200: "#b5bcca",
                    300: "#8791a7",
                    400: "#5d6880",
                    500: "#3a4560",
                    600: "#262f47",
                    700: "#1a2236",
                    800: "#121a2a",
                    900: "#0b1220",
                    DEFAULT: "#0b1220",
                },
                cream: {
                    50: "#fbf7ef",
                    100: "#f6efde",
                    200: "#eee2c4",
                    300: "#e3d2a6",
                    400: "#d4bc82",
                    500: "#c2a35e",
                    DEFAULT: "#f6efde",
                },
                brass: {
                    50: "#fbf3df",
                    100: "#f5e5b5",
                    200: "#e9cf78",
                    300: "#d7b34a",
                    400: "#b8932c",
                    500: "#96761f",
                    600: "#735919",
                    DEFAULT: "#b8932c",
                },
                slate: {
                    50: "#f4f4f2",
                    100: "#e5e5e1",
                    200: "#c8c8c1",
                    300: "#a3a397",
                    400: "#7c7c6f",
                    500: "#5c5c51",
                    600: "#44443c",
                    700: "#2f2f29",
                    DEFAULT: "#5c5c51",
                },
                status: {
                    occupied: "#b8932c",
                    available: "#3e7b5a",
                    flag: "#b5452c",
                    maintenance: "#7c7c6f",
                },
                // Back-compat aliases (existing code uses these heavily)
                blue: { DEFAULT: "#6366f1" },
                white: { DEFAULT: "#ffffff" },
            },
            fontFamily: {
                display: ['Fraunces', 'Georgia', 'serif'],
                sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
            },
            letterSpacing: {
                'editorial': '0.14em',
            },
            boxShadow: {
                paper: '0 1px 0 rgba(11,18,32,0.04), 0 12px 32px -20px rgba(11,18,32,0.18)',
                inset: 'inset 0 0 0 1px rgba(11,18,32,0.08)',
            },
            screens: {
                ssm: "320px",
                xxl: "1440px",
            },
            backgroundImage: {
                'grain': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.04  0 0 0 0 0.07  0 0 0 0 0.13  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            },
        },
    },
    plugins: [],
};
