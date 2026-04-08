/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 이 부분이 정확해야 스타일이 입혀집니다!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}