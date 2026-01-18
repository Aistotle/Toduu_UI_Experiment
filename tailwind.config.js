/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--ds-bg)',
        surface: 'var(--ds-surface)',
        ink: 'var(--ds-ink)',
        'ink-muted': 'var(--ds-ink-muted)',
        accent: 'var(--ds-accent)',
        'accent-completed': 'var(--ds-accent-completed)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        sm: 'var(--ds-radius-sm)',
        md: 'var(--ds-radius-md)',
        lg: 'var(--ds-radius-lg)',
      },
      boxShadow: {
        1: 'var(--ds-shadow-1)',
        2: 'var(--ds-shadow-2)',
        3: 'var(--ds-shadow-3)',
      },
      transitionTimingFunction: {
        ds: 'var(--ds-ease)',
      },
      transitionDuration: {
        fast: 'var(--ds-duration-fast)',
        normal: 'var(--ds-duration-normal)',
        slow: 'var(--ds-duration-slow)',
      },
    },
  },
  plugins: [],
}
