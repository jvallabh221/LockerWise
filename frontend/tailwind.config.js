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
                // LockerWise Brand Guidelines v2 — modern institutional SaaS
                //
                // NOTE on token keys: `ink`, `cream`, `brass`, `slate` are legacy
                // names kept for migration stability. Their VALUES are remapped
                // to the v2 palette so existing class usage flips automatically:
                //   ink.*   → navy scale (primary brand anchor)
                //   cream.* → neutral surfaces (was warm, now cool SaaS)
                //   brass.* → accent-blue scale (was amber, now cyan/sky)
                //   slate.* → cool neutral text/border scale
                ink: {
                    50:  "#EEF1F8",
                    100: "#DDE3F0",
                    200: "#B3C0D8",
                    300: "#6379A3",
                    400: "#3B5288",
                    500: "#243E72", // Navy 500
                    600: "#1F3A68",
                    700: "#1A3461", // Navy 700
                    800: "#0F2348",
                    900: "#0B1D3F", // Navy 900 — primary anchor
                    DEFAULT: "#0B1D3F",
                },
                cream: {
                    // Cool neutral surfaces. Shifted so existing `bg-cream-50`
                    // references (e.g. sticky table headers) still give a
                    // subtle off-white vs pure white rows.
                    50:  "#F9FAFC", // subtle off-white (sticky headers, hover rows)
                    100: "#F4F6FB", // Neutral 50 — page background
                    200: "#EEF1F8", // soft cool neutral
                    300: "#E9EDF5",
                    400: "#DDE3F0", // Neutral 200 — borders/dividers
                    500: "#C6CFDF",
                    DEFAULT: "#F4F6FB",
                },
                brass: {
                    50:  "#F0F9FF",
                    100: "#E0F2FE",
                    200: "#BAE6FD", // Accent Light
                    300: "#7DD3FC",
                    400: "#0EA5E9", // Accent — primary interactive blue
                    500: "#0369A1", // Accent Dark
                    600: "#075985",
                    DEFAULT: "#0EA5E9",
                },
                slate: {
                    50:  "#F4F6FB",
                    100: "#E9EDF5",
                    200: "#DDE3F0",
                    300: "#C6CFDF",
                    400: "#8C9BBA",
                    500: "#4D5D80", // Neutral 600 — muted text
                    600: "#3D4C6B",
                    700: "#2E3A56",
                    DEFAULT: "#4D5D80",
                },
                // Semantic tokens — precise, not loud
                success: {
                    50:  "#ECFDF5",
                    100: "#D1FAE5",
                    500: "#10B981",
                    600: "#059669",
                    700: "#047857",
                    DEFAULT: "#10B981",
                },
                warning: {
                    50:  "#FFFBEB",
                    100: "#FEF3C7",
                    500: "#F59E0B",
                    600: "#D97706",
                    700: "#B45309",
                    DEFAULT: "#F59E0B",
                },
                error: {
                    50:  "#FEF2F2",
                    100: "#FEE2E2",
                    500: "#EF4444",
                    600: "#DC2626",
                    700: "#B91C1C",
                    DEFAULT: "#EF4444",
                },
                // Kept for back-compat — maps locker status to semantic tones
                status: {
                    occupied:    "#F59E0B", // warning
                    available:   "#10B981", // success
                    expired:     "#EF4444", // error
                    flag:        "#EF4444",
                    maintenance: "#4D5D80",
                },
                // Back-compat alias (a few components still reference these)
                blue:  { DEFAULT: "#0EA5E9" },
                white: { DEFAULT: "#FFFFFF" },
            },
            fontFamily: {
                // Token keys unchanged. Values swapped to v2 stack.
                display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                sans:    ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono:    ['"DM Mono"', 'ui-monospace', 'Menlo', 'monospace'],
            },
            letterSpacing: {
                // Dialled down from 0.14em → 0.06em for a premium SaaS feel.
                editorial: '0.06em',
            },
            borderRadius: {
                // Named tokens for consistent SaaS radii
                xs: '4px',
                sm: '6px',
                md: '8px',
                lg: '10px',
                xl: '12px',
            },
            boxShadow: {
                // v2 shadows — navy-tinted, soft, premium (not heavy)
                xs:    '0 1px 2px 0 rgba(11, 29, 63, 0.04)',
                paper: '0 1px 2px rgba(11, 29, 63, 0.04), 0 4px 12px rgba(11, 29, 63, 0.06)',
                card:  '0 1px 2px rgba(11, 29, 63, 0.04), 0 4px 12px rgba(11, 29, 63, 0.06)',
                pop:   '0 4px 6px -1px rgba(11, 29, 63, 0.08), 0 10px 24px -6px rgba(11, 29, 63, 0.12)',
                ring:  '0 0 0 3px rgba(14, 165, 233, 0.18)',
                inset: 'inset 0 0 0 1px rgba(11, 29, 63, 0.06)',
            },
            screens: {
                ssm:  "320px",
                xxl:  "1440px",
            },
        },
    },
    plugins: [],
};
