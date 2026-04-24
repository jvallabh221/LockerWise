/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

    // Dark mode is driven by [data-theme="dark"] on <html>. Keeps the
    // `dark:` variant available without conflicting with the CSS-var
    // flip strategy in index.css.
    darkMode: ['class', '[data-theme="dark"]'],

    theme: {
        // Spec §10 responsive rules: 1440 / 1280 / 1024 / 768 / 375.
        screens: {
            xs:  "375px",
            sm:  "640px",
            md:  "768px",
            lg:  "1024px",
            xl:  "1280px",
            "2xl": "1440px",
        },
        extend: {
            colors: {
                /* -------------------------------------------------- */
                /*  BRAND — spec §4.1                                  */
                /*  Source of truth. Use `brand-*` in new code.        */
                /* -------------------------------------------------- */
                brand: {
                    900: "#0B1D3F",
                    800: "#12274F",
                    700: "#1A3461",
                    600: "#25477A",
                    500: "#0EA5E9",   // sky accent — CTAs, focus, links
                    400: "#38BDF8",
                    300: "#7DD3FC",
                    100: "#E0F2FE",   // sky tint — active sidebar item
                    DEFAULT: "#0B1D3F",
                },

                /* -------------------------------------------------- */
                /*  SEMANTIC SURFACES — bound to CSS vars              */
                /*  These flip automatically under [data-theme="dark"] */
                /* -------------------------------------------------- */
                bg:           "var(--bg)",
                surface:      "var(--surface)",
                surface2:     "var(--surface-2)",
                "surface-2":  "var(--surface-2)",
                borderc: {
                    DEFAULT: "var(--border)",
                    strong:  "var(--border-strong)",
                },
                textc: {
                    DEFAULT: "var(--text)",
                    2:       "var(--text-2)",
                    3:       "var(--text-3)",
                },

                /* -------------------------------------------------- */
                /*  LEGACY ALIASES                                     */
                /*  Values aligned to spec §4.2. Keep these keys —     */
                /*  they're used in ~40 page components. Swapping      */
                /*  them out is a separate refactor batch.             */
                /* -------------------------------------------------- */
                ink: {
                    50:  "#EEF1F8",
                    100: "#DDE2EF",   // = --border (was #DDE3F0, 1-digit shift)
                    200: "#C6CEDF",   // = --border-strong (was #B3C0D8)
                    300: "#7A84A3",   // = --text-3
                    400: "#475171",   // = --text-2
                    500: "#243E72",
                    600: "#1F3A68",
                    700: "#1A3461",   // = --brand-700
                    800: "#12274F",   // = --brand-800
                    900: "#0B1D3F",   // = --brand-900
                    DEFAULT: "#0B1D3F",
                },
                cream: {
                    50:  "#FBFCFE",   // = --surface-2
                    100: "#F7F8FC",   // = --bg
                    200: "#EEF1F8",
                    300: "#E9EDF5",
                    400: "#DDE2EF",   // = --border
                    500: "#C6CEDF",   // = --border-strong
                    DEFAULT: "#F7F8FC",
                },
                brass: {
                    50:  "#F0F9FF",   // = --info-bg
                    100: "#E0F2FE",   // = --brand-100
                    200: "#BAE6FD",
                    300: "#7DD3FC",   // = --brand-300
                    400: "#0EA5E9",   // = --brand-500 (primary interactive)
                    500: "#0369A1",
                    600: "#075985",
                    DEFAULT: "#0EA5E9",
                },
                slate: {
                    50:  "#F7F8FC",
                    100: "#E9EDF5",
                    200: "#DDE2EF",
                    300: "#C6CEDF",
                    400: "#7A84A3",   // = --text-3 (darker/more legible than before)
                    500: "#475171",   // = --text-2
                    600: "#3D4C6B",
                    700: "#2E3A56",
                    DEFAULT: "#475171",
                },

                /* -------------------------------------------------- */
                /*  SEMANTIC — spec §4.4                               */
                /* -------------------------------------------------- */
                success: {
                    50:  "#ECFDF5",   // = --success-bg
                    100: "#D1FAE5",
                    500: "#10B981",   // = --success
                    600: "#059669",
                    700: "#047857",
                    DEFAULT: "#10B981",
                },
                warning: {
                    50:  "#FFFBEB",   // = --warning-bg
                    100: "#FEF3C7",
                    500: "#F59E0B",   // = --warning
                    600: "#D97706",
                    700: "#B45309",
                    DEFAULT: "#F59E0B",
                },
                error: {
                    50:  "#FEF2F2",   // = --error-bg
                    100: "#FEE2E2",
                    500: "#EF4444",   // = --error
                    600: "#DC2626",
                    700: "#B91C1C",
                    DEFAULT: "#EF4444",
                },
                info: {
                    50:  "#F0F9FF",   // = --info-bg
                    500: "#0EA5E9",   // = --info
                    DEFAULT: "#0EA5E9",
                },

                /* Locker lifecycle mapping — kept for back-compat */
                status: {
                    occupied:    "#0EA5E9",   // info (spec §7.4: occupied → info)
                    available:   "#10B981",   // success
                    expiring:    "#F59E0B",   // warning
                    expired:     "#EF4444",   // error
                    flag:        "#EF4444",
                    maintenance: "#7A84A3",   // neutral
                },

                blue:  { DEFAULT: "#0EA5E9" },
                white: { DEFAULT: "#FFFFFF" },
            },

            fontFamily: {
                display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                sans:    ['"DM Sans"',       'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono:    ['"JetBrains Mono"', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
            },

            letterSpacing: {
                editorial: '0.06em',
            },

            /* Spec §4.7. Radii bumped: xl 12→16, 2xl added at 24.
               `rounded-xl` visually shifts +4px on modals / prominent
               cards — intentional per batch-1 scope. */
            borderRadius: {
                xs:   '4px',
                sm:   '6px',
                md:   '8px',
                lg:   '12px',
                xl:   '16px',
                '2xl':'24px',
            },

            /* Spec §4.8 shadows — softer, more diffuse. */
            boxShadow: {
                xs:    'var(--sh-xs)',
                sm:    'var(--sh-sm)',
                md:    'var(--sh-md)',
                lg:    'var(--sh-lg)',
                xl:    'var(--sh-xl)',
                // Legacy aliases (still referenced across pages)
                paper: 'var(--sh-sm)',
                card:  'var(--sh-sm)',
                pop:   'var(--sh-md)',
                ring:  '0 0 0 3px rgba(14, 165, 233, 0.15)',
                inset: 'inset 0 0 0 1px rgba(11, 29, 63, 0.06)',
            },

            /* Spec §4.9 motion. */
            transitionTimingFunction: {
                lw: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transitionDuration: {
                1: '120ms',
                2: '200ms',
                3: '320ms',
            },

            keyframes: {
                lwShimmer: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.55" },
                },
            },
            animation: {
                "lw-shimmer": "lwShimmer 1.2s linear infinite",
            },
        },
    },
    plugins: [],
};
