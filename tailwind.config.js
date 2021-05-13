const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./dist/*.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      // Build your palette here
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.trueGray,
      lime: colors.lime
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
