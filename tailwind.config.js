/** @type {import('tailwindcss').Config} */
export default {
  // corePlugins: {
  //   preflight: false,
  // },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/content/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem'
      }
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        '.el-button': {
           'background-color': "var(--el-button-bg-color,var(--el-color-white))"
        }
      })
    }
  ],
}