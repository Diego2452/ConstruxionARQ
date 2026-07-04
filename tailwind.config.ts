import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'site-bg':    '#151515',
        'site-black': '#000000',
        'accent':     '#C11D2A',
        'accent-alt': '#C1272D',
        'muted':      '#a4a4a4',
        'footer-bg':  '#212121',
      },
      fontFamily: {
        roboto:      ['Roboto', 'sans-serif'],
        'roboto-flex': ['Roboto Flex', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        wide2: '0.1em',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        'ken-burns': {
          '0%':   { transform: 'scale(1) translateX(0%)' },
          '50%':  { transform: 'scale(1.08) translateX(-1%)' },
          '100%': { transform: 'scale(1) translateX(0%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blink': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 14s ease-in-out infinite alternate',
        'fade-up':   'fade-up 0.8s ease forwards',
        'blink':     'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;
