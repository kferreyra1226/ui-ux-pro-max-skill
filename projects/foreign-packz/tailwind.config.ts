import type { Config } from 'tailwindcss';

/**
 * Foreign Packz design system - Tailwind theme.
 * Tokens mirror the CSS custom properties declared in src/app/globals.css so that
 * both utility classes and raw CSS read from a single source of truth.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101010', // primary background (near-black)
          soft: '#171717', // raised surface
          card: '#1B1B1B', // card surface
          line: '#2A2A2A', // hairline border on dark
        },
        bone: {
          DEFAULT: '#F4F0E8', // secondary background (warm off-white)
          soft: '#EAE4D8',
          line: '#D8D2C4',
        },
        emerald: {
          DEFAULT: '#1C614A', // main accent
          deep: '#134536',
          soft: '#25765C',
        },
        chrome: {
          DEFAULT: '#B7B7B7', // muted silver
          dim: '#8A8A8A',
        },
        acid: '#B6D85C', // sparing highlight only
        danger: '#D4544A',
        warn: '#D9A441',
      },
      fontFamily: {
        display: ['var(--fp-font-display)', 'Impact', 'Haettenschweiler', 'sans-serif'],
        sans: ['var(--fp-font-body)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.36), 0 8px 24px -12px rgba(0,0,0,.6)',
        lift: '0 2px 4px rgba(0,0,0,.4), 0 18px 40px -18px rgba(0,0,0,.75)',
        bone: '0 1px 2px rgba(16,16,16,.06), 0 10px 30px -18px rgba(16,16,16,.28)',
      },
      maxWidth: {
        shell: '1240px',
      },
      transitionTimingFunction: {
        fp: 'cubic-bezier(.2,.7,.3,1)',
      },
      keyframes: {
        'fp-fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fp-fade': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fp-slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fp-fade-up .5s cubic-bezier(.2,.7,.3,1) both',
        fade: 'fp-fade .3s ease both',
        'slide-in': 'fp-slide-in .32s cubic-bezier(.2,.7,.3,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
