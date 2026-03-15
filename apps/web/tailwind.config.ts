import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rouge-brand': '#390102',
        'gold-brand': '#BFAB92',
        rouge: '#6B0F1A',
        'rouge-mid': '#8C1424',
        'rouge-deep': '#3D0608',
        or: '#B8935A',
        'or-light': '#D4AF7A',
        encre: '#18080A',
        encre2: '#3D1E22',
        encre3: '#7A5459',
        creme: '#FAF5EF',
        creme2: '#F3EAE0',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
