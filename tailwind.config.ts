import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdff',
          100: '#ccf7ff',
          200: '#99efff',
          300: '#66e6ff',
          400: '#33deff',
          500: '#0cc0df',
          600: '#0a9eb8',
          700: '#087d92',
          800: '#065b6b',
          900: '#043945'
        },
        secondary: {
          500: '#3b82f6',
          600: '#2563eb'
        }
      }
    },
  },
  plugins: [],
}
export default config