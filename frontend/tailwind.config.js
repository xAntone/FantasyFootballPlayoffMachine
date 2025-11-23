/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                nfl: {
                    blue: '#013369',
                    red: '#D50A0A',
                    gray: '#A5ACAF',
                },
                modern: {
                    bg: '#020617', // Slate 950
                    card: '#0f172a', // Slate 900
                    accent: '#3b82f6', // Blue 500
                    success: '#10b981', // Emerald 500
                    warning: '#f59e0b', // Amber 500
                    error: '#ef4444', // Red 500
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    medium: 'rgba(255, 255, 255, 0.1)',
                    heavy: 'rgba(255, 255, 255, 0.2)',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
