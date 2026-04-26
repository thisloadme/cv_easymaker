import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        paper: '#faf9f7',
        accent: '#c45a3b',
        'accent-muted': '#e8d5cf',
        muted: '#6b6b6b',
        border: '#e0ddd8',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Serif 4', 'Georgia', 'serif'],
        ui: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
