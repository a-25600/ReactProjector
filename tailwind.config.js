/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#3BB0E5',
                    dark: '#1A202C',
                    light: '#F0F0F0',
                    accent: '#FFFFFF',
                    gray: '#718096'
                }
            },
            fontFamily: {
                sans: ['Arimo', 'sans-serif'],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '20px',
            }
        },
    },
    plugins: [],
}
