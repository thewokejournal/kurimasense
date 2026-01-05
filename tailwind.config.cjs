/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '1.5rem',
      },
    },
  },
  safelist: [
    // Keep commonly used dynamic color/bg classes from being purged
    'bg-emerald-900/30',
    'bg-green-900/30',
    'bg-red-900/30',
    'bg-emerald-500/30',
    'bg-emerald-500/20',
    'text-emerald-400',
    'text-green-400',
    'text-red-400',
    // Generic patterns (captures variants like hover:text-... as well)
    { pattern: /(bg|text)-(emerald|green|red|sky|slate)(-\d{3})?(\/\d{1,3})?/ },
  ],
  plugins: [],
}
