import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // This is a GitHub Pages *user* site (soham-kubal.github.io), served at
  // the domain root, so base stays '/' (unlike a project-page repo which
  // would need base: '/repo-name/').
  base: '/',
  plugins: [react(), tailwindcss()],
})
