import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                aura: {
                    mint: "#B4DBC0",
                    zinc: "#09090B",
                    violet: "#8B5CF6",
                    dark: "#120C0D",
                },
            },
            fontFamily: {
                sans: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                'grid': "linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)",
            },
        },
    },
    plugins: [],
} satisfies Config;
